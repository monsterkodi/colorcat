
/*
 0000000   0000000   000       0000000   00000000    0000000   0000000   000000000
000       000   000  000      000   000  000   000  000       000   000     000   
000       000   000  000      000   000  0000000    000       000000000     000   
000       000   000  000      000   000  000   000  000       000   000     000   
 0000000   0000000   0000000   0000000   000   000   0000000  000   000     000
 */

(function() {
  var _, args, bg, bgrd, bgrdColors, c, ci, colorStream, colorize, colors, config, dimText, expand, fatText, fs, funkyBgrd, funkyText, j, k, len, len1, len2, len3, log, m, matchr, matchrConfig, noon, o, pattern, patterns, ref, ref1, ref2, ref3, regexes, sds, stream, text, textColors,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  sds = require('sds');

  colors = require('colors');

  noon = require('noon');

  matchr = require('./matchr');

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
    textColors += "    " + c + "  . = false . - " + text[c] + " . ? " + (colors[c].bold('██')) + (colors[c]('██')) + (colors[c].dim('██')) + " " + (colors[c](c)) + "\n";
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
    ci = colors.black("    " + _.padEnd(c, 11));
    if (c === 'bgBlack' || c === 'bgBlue') {
      ci = colors.white("    " + _.padEnd(c, 11));
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
      log(n, s);
      s = colors[n](s);
    }
    return s;
  };

  regexes = [];

  expand = function(e) {
    var clrlst, cls, cnames, expd, invert, pat;
    clrlst = _.assign(text, bgrd);
    cnames = _.concat(_.keys(text), _.keys(bgrd));
    invert = _.invert(clrlst);
    invert.f = 'bold';
    invert.d = 'dim';
    expd = function(c) {
      if (indexOf.call(cnames, c) < 0) {
        return c.split('').map(function(a) {
          return invert[a];
        }).join('.');
      } else {
        return c;
      }
    };
    for (pat in e) {
      cls = e[pat];
      if (_.isArray(cls)) {
        e[pat] = cls.map(function(clr) {
          return expd(clr.split('.')[0]);
        });
      } else {
        e[pat] = expd(cls);
      }
    }
    return e;
  };

  if (args.pattern != null) {
    patterns = expand(noon.parse(args.pattern));
  }

  if (args.patternFile != null) {
    patterns = expand(sds.load(args.patternFile));
  }

  matchrConfig = null;

  if (patterns != null) {
    if (!args.pattern) {
      args.pattern = true;
    }
    config = _.mapValues(patterns, function(v) {
      if (_.isArray(v)) {
        return v.map(function(i) {
          return function(s) {
            return colorize(i, s);
          };
        });
      } else {
        return function(s) {
          return colorize(v, s);
        };
      }
    });
    matchrConfig = matchr.config(config);
  }

  pattern = function(chunk) {
    var clrzd, d, di, diss, len2, m, o, ref2, ref3, rngs, sv;
    rngs = matchr.ranges(matchrConfig, chunk);
    diss = matchr.dissect(rngs);
    log(noon.stringify(diss, {
      colors: true
    }));
    if (diss.length) {
      for (di = m = ref2 = diss.length - 1; ref2 <= 0 ? m <= 0 : m >= 0; di = ref2 <= 0 ? ++m : --m) {
        d = diss[di];
        clrzd = d.match;
        ref3 = d.stack;
        for (o = 0, len2 = ref3.length; o < len2; o++) {
          sv = ref3[o];
          clrzd = sv(clrzd);
        }
        chunk = chunk.slice(0, d.start) + clrzd + chunk.slice(d.start + d.match.length);
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
      return process.stdout.write(colorLines.join('\n'));
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
