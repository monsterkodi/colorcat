
/*
 0000000   0000000   000       0000000   00000000    0000000   0000000   000000000
000       000   000  000      000   000  000   000  000       000   000     000   
000       000   000  000      000   000  0000000    000       000000000     000   
000       000   000  000      000   000  000   000  000       000   000     000   
 0000000   0000000   0000000   0000000   000   000   0000000  000   000     000
 */

(function() {
  var _, args, bg, bgrd, bgrdColors, c, ci, colorStream, colors, dimText, fatText, fs, funkyBgrd, funkyText, i, j, k, len, len1, len2, len3, log, m, noon, ref, ref1, ref2, ref3, stream, text, textColors;

  fs = require('fs');

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
    gray: 'z',
    black: 'x',
    white: 'w'
  };

  textColors = '';

  ref = _.keys(text);
  for (i = 0, len = ref.length; i < len; i++) {
    c = ref[i];
    textColors += "    " + c + "  . = false . - " + text[c] + " . ? " + (colors[c]('██'.bold)) + (colors[c]('██')) + (colors[c].dim('██')) + " " + (colors[c](c)) + "\n";
  }

  bgrd = {
    onBlack: 'Z',
    onRed: 'R',
    onGreen: 'G',
    onBlue: 'B',
    onYellow: 'Y',
    onMagenta: 'M',
    onCyan: 'C',
    onWhite: 'W'
  };

  bgrdColors = '';

  ref1 = _.keys(bgrd);
  for (j = 0, len1 = ref1.length; j < len1; j++) {
    c = ref1[j];
    bg = 'bg' + c.substr(2);
    ci = ("    " + _.padEnd(c, 11)).black;
    if (c === 'onBlack' || c === 'onBlue') {
      ci = ("    " + _.padEnd(c, 11)).white;
    }
    bgrdColors += "    " + c + "  . = false . - " + bgrd[c] + " . ? " + (colors.reset(colors[bg](ci))) + "\n";
  }

  args = require('karg')("\ncolorcat\n\n    file        . ? the file to display or stdin . *\n" + textColors + "\n    fat         . ? " + '▲▲     fat'.bold.white + "   . = false\n    dim                                          . = false\n        ?          |" + '    ▲▲ dim'.dim.white + " \n" + bgrdColors + "\n    \nversion   " + (require(__dirname + "/../package.json").version));


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
  for (k = 0, len2 = ref2.length; k < len2; k++) {
    c = ref2[k];
    if (args[c]) {
      funkyText = colors[c];
    }
  }

  ref3 = _.keys(bgrd);
  for (m = 0, len3 = ref3.length; m < len3; m++) {
    c = ref3[m];
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

  colorStream = function(stream) {
    return stream.on('data', function(chunk) {
      return log(chunk.split('\n').map(function(l) {
        return funkyBgrd(dimText(l));
      }).join(colors.reset('\n')));
    });
  };

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
