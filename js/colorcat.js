
/*
 0000000   0000000   000       0000000   00000000    0000000   0000000   000000000
000       000   000  000      000   000  000   000  000       000   000     000   
000       000   000  000      000   000  0000000    000       000000000     000   
000       000   000  000      000   000  000   000  000       000   000     000   
 0000000   0000000   0000000   0000000   000   000   0000000  000   000     000
 */

(function() {
  var _, amap, ansi, args, bg, bgrd, bgrdColors, c, ci, colorStream, colorize, colors, dimText, error, expand, fatText, fs, funkyBgrd, funkyText, j, k, len, len1, len2, len3, log, m, matchr, matchrConfig, noon, o, path, pattern, patterns, ref, ref1, ref2, ref3, regexes, sds, stream, syntaxFile, text, textColors,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  sds = require('sds');

  path = require('path');

  colors = require('colors');

  noon = require('noon');

  matchr = require('./matchr');

  _ = require('lodash');

  log = console.log;

  error = function(err) {
    return process.stderr.write("[ERROR] " + err + "\n");
  };


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

  args = require('karg')("\ncolorcat\n\n    file         . ? the file to display or stdin . *\n" + textColors + "\n    fat          . ? " + '▲▲     fat'.bold.white + "   . = false\n    dim                                           . = false\n        ?           |" + '    ▲▲ dim'.dim.white + " \n" + bgrdColors + "\n    pattern      . ? colorize with pattern\n    patternFile  . ? colorize with patterns in file . - P\n    ansi256      . ? use 256 colors ansi codes    . = false\n    \nansi256              \n            ∘ use " + 'ansi-256-colors'.gray.bold + " instead of " + 'colors'.gray.bold + " module\n            ∘ colors don't get stripped when piping\n    \nversion   " + (require(__dirname + "/../package.json").version));


  /*
   0000000   000   000   0000000  000
  000   000  0000  000  000       000
  000000000  000 0 000  0000000   000
  000   000  000  0000       000  000
  000   000  000   000  0000000   000
   */

  ansi = null;

  amap = null;

  if (args.ansi256) {
    ansi = require('./colors');
    amap = {
      red: [ansi.r2, ansi.r4, ansi.r5],
      green: [ansi.g2, ansi.g4, ansi.g5],
      blue: [ansi.b2, ansi.b6, ansi.b7],
      yellow: [ansi.y2, ansi.y5, ansi.y6],
      magenta: [ansi.m1, ansi.m2, ansi.m4],
      cyan: [ansi.c1, ansi.c2, ansi.c4],
      black: [ansi.w1, ansi.w1, ansi.w2],
      gray: [ansi.w2, ansi.w4, ansi.w5],
      white: [ansi.w6, ansi.w7, ansi.w8],
      bgRed: [ansi.R4, ansi.R4, ansi.R4],
      bgGreen: [ansi.G4, ansi.G4, ansi.G4],
      bgBlue: [ansi.B6, ansi.B6, ansi.B6],
      bgYellow: [ansi.Y5, ansi.Y5, ansi.Y5],
      bgMagenta: [ansi.M2, ansi.M2, ansi.M2],
      bgCyan: [ansi.C2, ansi.C2, ansi.C2],
      bgBlack: [ansi.W1, ansi.W1, ansi.W1],
      bgGray: [ansi.W4, ansi.W4, ansi.W4],
      bgWhite: [ansi.W7, ansi.W7, ansi.W7]
    };
  }


  /*
   0000000   0000000   000       0000000   00000000   000  0000000  00000000
  000       000   000  000      000   000  000   000  000     000   000     
  000       000   000  000      000   000  0000000    000    000    0000000 
  000       000   000  000      000   000  000   000  000   000     000     
   0000000   0000000   0000000   0000000   000   000  000  0000000  00000000
   */

  colorize = function(str, stack) {
    var err, error1, i, len2, len3, len4, m, n, o, p, s, spl;
    try {
      spl = stack.map(function(s) {
        return String(s).split('.');
      });
      spl = _.flatten(spl);
      for (m = 0, len2 = spl.length; m < len2; m++) {
        s = spl[m];
        if (s.substr(0, 2) === 's:') {
          str = s.substr(2);
          spl = spl.filter(function(s) {
            return s.substr(0, 2) !== 's:';
          });
          break;
        }
      }
      if (args.ansi256) {
        i = 1;
        if (indexOf.call(spl, 'bold') >= 0) {
          i = 2;
        }
        if (indexOf.call(spl, 'dim') >= 0) {
          i = 0;
        }
        for (o = 0, len3 = spl.length; o < len3; o++) {
          n = spl[o];
          if (amap[n] != null) {
            str = amap[n][i] + str;
          }
        }
        if (indexOf.call(spl, 'bold') >= 0) {
          str = ansi.bold + str;
        }
        str += ansi.reset;
      } else {
        for (p = 0, len4 = spl.length; p < len4; p++) {
          n = spl[p];
          if (colors[n] != null) {
            str = colors[n](str);
          }
        }
      }
    } catch (error1) {
      err = error1;
      error(err);
    }
    return str;
  };


  /*
  00000000  000   000  00000000    0000000   000   000  0000000  
  000        000 000   000   000  000   000  0000  000  000   000
  0000000     00000    00000000   000000000  000 0 000  000   000
  000        000 000   000        000   000  000  0000  000   000
  00000000  000   000  000        000   000  000   000  0000000
   */

  regexes = [];

  expand = function(e) {
    var clrlst, cls, cnames, expd, invert, pat;
    clrlst = _.assign(text, bgrd);
    cnames = _.concat(_.keys(text), _.keys(bgrd));
    invert = _.invert(clrlst);
    invert.f = 'bold';
    invert.d = 'dim';
    expd = function(c) {
      var r, s;
      if ((c != null) && indexOf.call(cnames, c) < 0) {
        s = c.split('s\:');
        r = s[0].split('').map(function(a) {
          return invert[a];
        }).join('.');
        if (s.length > 1) {
          r += '.s:' + s[1];
        }
        return r;
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


  /*
  00000000    0000000   000000000  000000000  00000000  00000000   000   000   0000000
  000   000  000   000     000        000     000       000   000  0000  000  000     
  00000000   000000000     000        000     0000000   0000000    000 0 000  0000000 
  000        000   000     000        000     000       000   000  000  0000       000
  000        000   000     000        000     00000000  000   000  000   000  0000000
   */

  if (args.file != null) {
    syntaxFile = path.join(__dirname, '..', 'syntax', path.extname(args.file).substr(1) + '.noon');
    if (fs.existsSync(syntaxFile)) {
      patterns = expand(sds.load(syntaxFile));
    }
  }

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
    matchrConfig = matchr.config(patterns);
  }

  pattern = function(chunk) {
    var clrzd, d, di, diss, m, ref2, rngs;
    rngs = matchr.ranges(matchrConfig, chunk);
    diss = matchr.dissect(rngs);
    if (diss.length) {
      for (di = m = ref2 = diss.length - 1; ref2 <= 0 ? m <= 0 : m >= 0; di = ref2 <= 0 ? ++m : --m) {
        d = diss[di];
        clrzd = colorize(d.match, d.stack.reverse());
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
      lines = chunk.split('\n').filter(function(l) {
        return l.length > 0;
      });
      if (args.pattern) {
        colorLines = lines.map(function(l) {
          return pattern(l);
        });
      } else {
        colorLines = lines.map(function(l) {
          return funkyBgrd(dimText(l));
        });
      }
      return log(colorLines.join('\n'));
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
