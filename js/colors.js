
/*
 0000000   0000000   000       0000000   00000000    0000000
000       000   000  000      000   000  000   000  000     
000       000   000  000      000   000  0000000    0000000 
000       000   000  000      000   000  000   000       000
 0000000   0000000   0000000   0000000   000   000  0000000
 */

(function() {
  var B, B1, B2, B3, B4, B5, B6, B7, B8, BG_COLORS, C, C1, C2, C3, C4, C5, C6, C7, C8, FG_COLORS, G, G1, G2, G3, G4, G5, G6, G7, G8, M, M1, M2, M3, M4, M5, M6, M7, M8, R, R1, R2, R3, R4, R5, R6, R7, R8, W, W1, W2, W3, W4, W5, W6, W7, W8, Y, Y1, Y2, Y3, Y4, Y5, Y6, Y7, Y8, b, b1, b2, b3, b4, b5, b6, b7, b8, bg, bi, bn, bold, c, c1, c2, c3, c4, c5, c6, c7, c8, colors, fg, g, g1, g2, g3, g4, g5, g6, g7, g8, i, j, k, l, len, len1, log, m, m1, m2, m3, m4, m5, m6, m7, m8, n, r, r1, r2, r3, r4, r5, r6, r7, r8, reset, w, w1, w2, w3, w4, w5, w6, w7, w8, y, y1, y2, y3, y4, y5, y6, y7, y8;

  colors = require('ansi-256-colors');

  log = console.log;

  r = function(i) {
    if (i == null) {
      i = 4;
    }
    return (i < 6) && colors.fg.getRgb(i, 0, 0) || colors.fg.getRgb(5, i - 5, i - 5);
  };

  R = function(i) {
    if (i == null) {
      i = 4;
    }
    return (i < 6) && colors.bg.getRgb(i, 0, 0) || colors.bg.getRgb(5, i - 5, i - 5);
  };

  g = function(i) {
    if (i == null) {
      i = 4;
    }
    return (i < 6) && colors.fg.getRgb(0, i, 0) || colors.fg.getRgb(i - 5, 5, i - 5);
  };

  G = function(i) {
    if (i == null) {
      i = 4;
    }
    return (i < 6) && colors.bg.getRgb(0, i, 0) || colors.bg.getRgb(i - 5, 5, i - 5);
  };

  b = function(i) {
    if (i == null) {
      i = 4;
    }
    return (i < 6) && colors.fg.getRgb(0, 0, i) || colors.fg.getRgb(i - 5, i - 5, 5);
  };

  B = function(i) {
    if (i == null) {
      i = 4;
    }
    return (i < 6) && colors.bg.getRgb(0, 0, i) || colors.bg.getRgb(i - 5, i - 5, 5);
  };

  y = function(i) {
    if (i == null) {
      i = 4;
    }
    return (i < 6) && colors.fg.getRgb(i, i, 0) || colors.fg.getRgb(5, 5, i - 5);
  };

  Y = function(i) {
    if (i == null) {
      i = 4;
    }
    return (i < 6) && colors.bg.getRgb(i, i, 0) || colors.bg.getRgb(5, 5, i - 5);
  };

  m = function(i) {
    if (i == null) {
      i = 4;
    }
    return (i < 6) && colors.fg.getRgb(i, 0, i) || colors.fg.getRgb(5, i - 5, 5);
  };

  M = function(i) {
    if (i == null) {
      i = 4;
    }
    return (i < 6) && colors.bg.getRgb(i, 0, i) || colors.bg.getRgb(5, i - 5, 5);
  };

  c = function(i) {
    if (i == null) {
      i = 4;
    }
    return (i < 6) && colors.fg.getRgb(0, i, i) || colors.fg.getRgb(i - 5, 5, 5);
  };

  C = function(i) {
    if (i == null) {
      i = 4;
    }
    return (i < 6) && colors.bg.getRgb(0, i, i) || colors.bg.getRgb(i - 5, 5, 5);
  };

  w = function(i) {
    if (i == null) {
      i = 4;
    }
    return colors.fg.grayscale[i];
  };

  W = function(i) {
    if (i == null) {
      i = 4;
    }
    return colors.bg.grayscale[i];
  };

  r1 = r(1);

  R1 = R(1);

  g1 = g(1);

  G1 = G(1);

  b1 = b(1);

  B1 = B(1);

  r2 = r(2);

  R2 = R(2);

  g2 = g(2);

  G2 = G(2);

  b2 = b(2);

  B2 = B(2);

  r3 = r(3);

  R3 = R(3);

  g3 = g(3);

  G3 = G(3);

  b3 = b(3);

  B3 = B(3);

  r4 = r(4);

  R4 = R(4);

  g4 = g(4);

  G4 = G(4);

  b4 = b(4);

  B4 = B(4);

  r5 = r(5);

  R5 = R(5);

  g5 = g(5);

  G5 = G(5);

  b5 = b(5);

  B5 = B(5);

  r6 = r(6);

  R6 = R(6);

  g6 = g(6);

  G6 = G(6);

  b6 = b(6);

  B6 = B(6);

  r7 = r(7);

  R7 = R(7);

  g7 = g(7);

  G7 = G(7);

  b7 = b(7);

  B7 = B(7);

  r8 = r(8);

  R8 = R(8);

  g8 = g(8);

  G8 = G(8);

  b8 = b(8);

  B8 = B(8);

  c1 = c(1);

  C1 = C(1);

  m1 = m(1);

  M1 = M(1);

  y1 = y(1);

  Y1 = Y(1);

  c2 = c(2);

  C2 = C(2);

  m2 = m(2);

  M2 = M(2);

  y2 = y(2);

  Y2 = Y(2);

  c3 = c(3);

  C3 = C(3);

  m3 = m(3);

  M3 = M(3);

  y3 = y(3);

  Y3 = Y(3);

  c4 = c(4);

  C4 = C(4);

  m4 = m(4);

  M4 = M(4);

  y4 = y(4);

  Y4 = Y(4);

  c5 = c(5);

  C5 = C(5);

  m5 = m(5);

  M5 = M(5);

  y5 = y(5);

  Y5 = Y(5);

  c6 = c(6);

  C6 = C(6);

  m6 = m(6);

  M6 = M(6);

  y6 = y(6);

  Y6 = Y(6);

  c7 = c(7);

  C7 = C(7);

  m7 = m(7);

  M7 = M(7);

  y7 = y(7);

  Y7 = Y(7);

  c8 = c(8);

  C8 = C(8);

  m8 = m(8);

  M8 = M(8);

  y8 = y(8);

  Y8 = Y(8);

  w1 = w(0 * 3);

  W1 = W(0 * 3 + 2);

  w2 = w(1 * 3);

  W2 = W(1 * 3 + 2);

  w3 = w(2 * 3);

  W3 = W(2 * 3 + 2);

  w4 = w(3 * 3);

  W4 = W(3 * 3 + 2);

  w5 = w(4 * 3);

  W5 = W(4 * 3 + 2);

  w6 = w(5 * 3);

  W6 = W(5 * 3 + 2);

  w7 = w(6 * 3);

  W7 = W(6 * 3 + 2);

  w8 = w(7 * 3);

  W8 = W(7 * 3 + 2);

  FG_COLORS = ['r', 'g', 'b', 'c', 'm', 'y', 'w'];

  BG_COLORS = ['R', 'M', 'B', 'Y', 'G', 'C', 'W'];

  reset = module.exports.reset = colors.reset;

  bold = module.exports.bold = '\x1b[1m';

  for (j = 0, len = BG_COLORS.length; j < len; j++) {
    bg = BG_COLORS[j];
    module.exports[bg] = eval(bg);
    for (bi = k = 1; k <= 8; bi = ++k) {
      bn = bg + bi;
      module.exports[bn] = eval(bn);
    }
  }

  for (l = 0, len1 = FG_COLORS.length; l < len1; l++) {
    fg = FG_COLORS[l];
    module.exports[fg] = eval(fg);
    for (i = n = 1; n <= 8; i = ++n) {
      module.exports[fg + String(i)] = eval(fg + String(i));
    }
  }

  module.exports.fg = colors.fg.getRgb;

  module.exports.bg = colors.bg.getRgb;

  module.exports.strip = function(s) {
    return s.replace(/\u001b\[*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[m]/g, '');
  };

  module.exports.show = function() {
    var fn, len2, len3, o, p, q, s;
    for (o = 0, len2 = BG_COLORS.length; o < len2; o++) {
      bg = BG_COLORS[o];
      for (bi = p = 1; p <= 8; bi = ++p) {
        s = reset;
        bn = bg + bi;
        s += eval(bg.toLowerCase() + bi) + bold;
        s += ((bg.toLowerCase() + bi) + " " + (bg + bi) + " ") + reset + eval(bn);
        for (q = 0, len3 = FG_COLORS.length; q < len3; q++) {
          fg = FG_COLORS[q];
          fn = bn + fg;
          s += module.exports[fn] + ' ' + fg + ' ';
        }
        log(s + reset);
      }
    }
    return log(" ");
  };

}).call(this);
