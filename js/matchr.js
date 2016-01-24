
/*
00     00   0000000   000000000   0000000  000   000  00000000 
000   000  000   000     000     000       000   000  000   000
000000000  000000000     000     000       000000000  0000000  
000 0 000  000   000     000     000       000   000  000   000
000   000  000   000     000      0000000  000   000  000   000
 */

(function() {
  var _, config, dissect, ranges;

  _ = require('lodash');


  /*
   0000000   0000000   000   000  00000000  000   0000000 
  000       000   000  0000  000  000       000  000      
  000       000   000  000 0 000  000000    000  000  0000
  000       000   000  000  0000  000       000  000   000
   0000000   0000000   000   000  000       000   0000000 
  
  convert the patterns object to a list of [RegExp(key), value] pairs
   */

  config = function(patterns) {
    var a, p, results;
    results = [];
    for (p in patterns) {
      a = patterns[p];
      results.push([new RegExp(p), a]);
    }
    return results;
  };


  /*
  00000000    0000000   000   000   0000000   00000000   0000000
  000   000  000   000  0000  000  000        000       000     
  0000000    000000000  000 0 000  000  0000  0000000   0000000 
  000   000  000   000  000  0000  000   000  000            000
  000   000  000   000  000   000   0000000   00000000  0000000 
  
  accepts a list of [regexp, value(s)] pairs and a string
  returns a list of objects with information about the matches:
  
      match: the matched substring
      start: position of match in str
      value: the value for the match
      index: the index of the regexp 
      
      the objects are sorted by start, match.length and index
      
      if the regexp has capture groups then 
          the value for the match of the nth group is
              the nth item of values(s) if value(s) is an array
              the nth [key, value] pair if value(s) is an object
   */

  ranges = function(regexes, str) {
    var arg, i, j, k, l, match, r, ref, ref1, reg, s, value;
    ranges = [];
    for (r = k = 0, ref = regexes.length; 0 <= ref ? k < ref : k > ref; r = 0 <= ref ? ++k : --k) {
      reg = regexes[r][0];
      arg = regexes[r][1];
      i = 0;
      s = str;
      while (s.length) {
        match = reg.exec(s);
        if (match == null) {
          break;
        }
        if (match.length === 1) {
          ranges.push({
            start: match.index + i,
            match: match[0],
            value: arg,
            index: r
          });
          i += match.index + match[0].length;
          s = str.slice(i);
        } else {
          for (j = l = 0, ref1 = match.length - 2; 0 <= ref1 ? l <= ref1 : l >= ref1; j = 0 <= ref1 ? ++l : --l) {
            value = arg;
            if (_.isArray(value) && j < value.length) {
              value = value[j];
            } else if (_.isObject(value) && j < _.size(value)) {
              value = [_.keys(value)[j], value[_.keys(value)[j]]];
            }
            ranges.push({
              start: match.index + i + match[0].indexOf(match[j + 1]),
              match: match[j + 1],
              value: value,
              index: r
            });
          }
          i += match.index + match[0].length;
          s = str.slice(i);
        }
      }
    }
    return ranges.sort(function(a, b) {
      if (a.start === b.start) {
        if (a.match.length === b.match.length) {
          return a.index - b.index;
        } else {
          return a.match.length - b.match.length;
        }
      } else {
        return a.start - b.start;
      }
    });
  };


  /*
  0000000    000   0000000   0000000  00000000   0000000  000000000
  000   000  000  000       000       000       000          000   
  000   000  000  0000000   0000000   0000000   000          000   
  000   000  000       000       000  000       000          000   
  0000000    000  0000000   0000000   00000000   0000000     000   
  
  accepts a list of ranges
  returns a new list of objects
  
      match: the matched substring
      start: position of match in str
      stack: list of values
      
      with none of the [start, start+match.length] ranges overlapping
   */

  dissect = function(ranges) {
    var d, di, i, k, l, m, p, pn, ref, ref1, ref2, rg, ri, si;
    if (!ranges.length) {
      return [];
    }
    di = [];
    for (ri = k = 0, ref = ranges.length; 0 <= ref ? k < ref : k > ref; ri = 0 <= ref ? ++k : --k) {
      rg = ranges[ri];
      di.push([rg.start, ri]);
      di.push([rg.start + rg.match.length]);
    }
    di.sort(function(a, b) {
      if (a[0] === b[0]) {
        return a[1] - b[1];
      } else {
        return a[0] - b[0];
      }
    });
    d = [];
    si = -1;
    for (i = l = 0, ref1 = di.length - 1; 0 <= ref1 ? l < ref1 : l > ref1; i = 0 <= ref1 ? ++l : --l) {
      if (di[i][0] > si) {
        si = di[i][0];
        d.push({
          start: si,
          stack: []
        });
      }
    }
    p = 0;
    for (ri = m = 0, ref2 = ranges.length; 0 <= ref2 ? m < ref2 : m > ref2; ri = 0 <= ref2 ? ++m : --m) {
      rg = ranges[ri];
      while (d[p].start < rg.start) {
        p += 1;
      }
      pn = p;
      while (d[pn].start < rg.start + rg.match.length) {
        d[pn].stack.push([rg.index, rg.value]);
        if (pn + 1 < d.length) {
          if (!d[pn].match) {
            d[pn].match = rg.match.substr(d[pn].start - rg.start, d[pn + 1].start - d[pn].start);
          }
          pn += 1;
        } else {
          if (!d[pn].match) {
            d[pn].match = rg.match.substr(d[pn].start - rg.start);
          }
          break;
        }
      }
    }
    d = d.filter(function(i) {
      return i.match != null;
    });
    return d = d.map(function(i) {
      i.stack = i.stack.sort(function(a, b) {
        return a[0] - b[0];
      }).map(function(j) {
        return j[1];
      });
      return i;
    });
  };

  module.exports = {
    config: config,
    ranges: ranges,
    dissect: dissect
  };

}).call(this);
