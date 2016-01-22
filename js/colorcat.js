
/*
 0000000   0000000   000       0000000   00000000    0000000   0000000   000000000
000       000   000  000      000   000  000   000  000       000   000     000   
000       000   000  000      000   000  0000000    000       000000000     000   
000       000   000  000      000   000  000   000  000       000   000     000   
 0000000   0000000   0000000   0000000   000   000   0000000  000   000     000
 */

(function() {
  var _, args, bg, bgrd, bgrdColors, c, ci, colorStream, colorize, colors, dimText, expand, fatText, fs, funkyBgrd, funkyText, j, k, len, len1, len2, len3, log, m, noon, o, pattern, patterns, r, ref, ref1, ref2, ref3, regexes, sds, stream, text, textColors,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  sds = require('sds');

  colors = require('colors');

  noon = require('noon');

  _ = require('lodash');

  log = console.log;


  /*
   0000000   00000000    0000000    0000000
  000   000  000   000  000        000     
  000000000  0000000    000  0000  0000000 
  000   000  000   000  000   000       000
  000   000  000   000   0000000   0000000
   */

  text = {
    red: 'r',
    green: 'g',
    blue: 'b',
    yellow: 'y',
    magenta: 'm',
    cyan: 'c',
    gray: 'x',
    black: 'z',
    white: 'w'
  };

  textColors = '';

  ref = _.keys(text);
  for (j = 0, len = ref.length; j < len; j++) {
    c = ref[j];
    textColors += "    " + c + "  . = false . - " + text[c] + " . ? " + (colors[c]('██'.bold)) + (colors[c]('██')) + (colors[c].dim('██')) + " " + (colors[c](c)) + "\n";
  }

  bgrd = {
    bgBlack: 'Z',
    bgRed: 'R',
    bgGreen: 'G',
    bgBlue: 'B',
    bgYellow: 'Y',
    bgMagenta: 'M',
    bgCyan: 'C',
    bgWhite: 'W'
  };

  bgrdColors = '';

  ref1 = _.keys(bgrd);
  for (k = 0, len1 = ref1.length; k < len1; k++) {
    c = ref1[k];
    bg = 'bg' + c.substr(2);
    ci = ("    " + _.padEnd(c, 11)).black;
    if (c === 'onBlack' || c === 'onBlue') {
      ci = ("    " + _.padEnd(c, 11)).white;
    }
    bgrdColors += "    " + c + "  . = false . - " + bgrd[c] + " . ? " + (colors.reset(colors[bg](ci))) + "\n";
  }

  args = require('karg')("\ncolorcat\n\n    file         . ? the file to display or stdin . *\n" + textColors + "\n    fat          . ? " + '▲▲     fat'.bold.white + "   . = false\n    dim                                           . = false\n        ?           |" + '    ▲▲ dim'.dim.white + " \n" + bgrdColors + "\n    pattern      . ? colorize with pattern\n    patternFile  . ? colorize with patterns in file . - P\n    \nversion   " + (require(__dirname + "/../package.json").version));


  /*
  00000000    0000000   000000000  000000000  00000000  00000000   000   000
  000   000  000   000     000        000     000       000   000  0000  000
  00000000   000000000     000        000     0000000   0000000    000 0 000
  000        000   000     000        000     000       000   000  000  0000
  000        000   000     000        000     00000000  000   000  000   000
   */

  colorize = function(names, s) {
    var len2, m, n, ref2;
    ref2 = names.split('.');
    for (m = 0, len2 = ref2.length; m < len2; m++) {
      n = ref2[m];
      s = colors[n](s);
    }
    return s;
  };

  regexes = [];

  expand = function(e) {
    var clrlst, cls, cnames, invert, pat;
    clrlst = _.assign(text, bgrd);
    cnames = _.concat(_.keys(text), _.keys(bgrd));
    invert = _.invert(clrlst);
    invert.f = 'bold';
    invert.d = 'dim';
    for (pat in e) {
      cls = e[pat];
      e[pat] = cls.map(function(clr) {
        c = clr.split('.')[0];
        if (indexOf.call(cnames, c) < 0) {
          return c.split('').map(function(a) {
            return invert[a];
          }).join('.');
        } else {
          return c;
        }
      });
    }
    return e;
  };

  if (args.pattern != null) {
    patterns = expand(noon.parse(args.pattern));
  }

  if (args.patternFile != null) {
    patterns = expand(sds.load(args.patternFile));
  }

  if (patterns != null) {
    if (!args.pattern) {
      args.pattern = true;
    }
    for (r in patterns) {
      c = patterns[r];
      regexes.push({
        reg: new RegExp(r),
        fun: c.map(function(i) {
          return function(s) {
            return colorize(i, s);
          };
        })
      });
    }
  }

  pattern = function(chunk) {
    var i, len2, len3, m, match, matches, o, p, ref2, s;
    matches = [];
    for (m = 0, len2 = regexes.length; m < len2; m++) {
      r = regexes[m];
      match = r.reg.exec(chunk);
      if ((match != null) && match.length > 1) {
        match.fun = r.fun;
        matches.push(match);
      }
    }
    if (matches) {
      matches.sort(function(a, b) {
        return a.index < b.index;
      });
      for (o = 0, len3 = matches.length; o < len3; o++) {
        match = matches[o];
        s = '';
        for (i = p = 0, ref2 = match.length - 2; 0 <= ref2 ? p <= ref2 : p >= ref2; i = 0 <= ref2 ? ++p : --p) {
          s += match.fun[i](match[i + 1]);
        }
        chunk = (chunk.slice(0, match.index)) + s + chunk.slice(match.index + match[0].length);
      }
    }
    return chunk;
  };


  /*
  00000000  000   000  000   000  000   000  000   000
  000       000   000  0000  000  000  000    000 000 
  000000    000   000  000 0 000  0000000      00000  
  000       000   000  000  0000  000  000      000   
  000        0000000   000   000  000   000     000
   */

  funkyText = function(s) {
    return s;
  };

  funkyBgrd = function(s) {
    return s;
  };

  ref2 = _.keys(text);
  for (m = 0, len2 = ref2.length; m < len2; m++) {
    c = ref2[m];
    if (args[c]) {
      funkyText = colors[c];
    }
  }

  ref3 = _.keys(bgrd);
  for (o = 0, len3 = ref3.length; o < len3; o++) {
    c = ref3[o];
    if (args[c]) {
      funkyBgrd = colors['bg' + c.substr(2)];
    }
  }

  if (args.fat) {
    fatText = function(s) {
      return funkyText(s).bold;
    };
  } else {
    fatText = funkyText;
  }

  if (args.dim) {
    dimText = function(s) {
      return fatText(s).dim;
    };
  } else {
    dimText = fatText;
  }


  /*
   0000000  000000000  00000000   00000000   0000000   00     00
  000          000     000   000  000       000   000  000   000
  0000000      000     0000000    0000000   000000000  000000000
       000     000     000   000  000       000   000  000 0 000
  0000000      000     000   000  00000000  000   000  000   000
   */

  colorStream = function(stream) {
    return stream.on('data', function(chunk) {
      var colorLines, lines;
      lines = chunk.split('\n');
      if (args.pattern) {
        colorLines = lines.map(function(l) {
          return pattern(l);
        });
      } else {
        colorLines = lines.map(function(l) {
          return funkyBgrd(dimText(l));
        });
      }
      return log(colorLines.join(colors.reset('\n')));
    });
  };


  /*
   0000000   0000000   000000000      000  00000000  000  000      00000000
  000       000   000     000        000   000       000  000      000     
  000       000000000     000       000    000000    000  000      0000000 
  000       000   000     000      000     000       000  000      000     
   0000000  000   000     000     000      000       000  0000000  00000000
   */

  if (args.file) {
    stream = fs.createReadStream(args.file, {
      encoding: 'utf8'
    });
    colorStream(stream);
  } else {
    process.stdin.setEncoding('utf8');
    colorStream(process.stdin);
  }

}).call(this);
