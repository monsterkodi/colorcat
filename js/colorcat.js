// koffee 1.3.0

/*
 0000000   0000000   000       0000000   00000000    0000000   0000000   000000000
000       000   000  000      000   000  000   000  000       000   000     000   
000       000   000  000      000   000  0000000    000       000000000     000   
000       000   000  000      000   000  000   000  000       000   000     000   
 0000000   0000000   0000000   0000000   000   000   0000000  000   000     000
 */
var NEWLINE, args, bgfunc, bgrd, bgrdColors, c, clrlst, cnames, colorStream, colorize, dimText, expand, fatText, fbgcol, fbgnms, file, funkyBgrd, funkyText, i, invert, j, k, karg, klor, kolor, len, len1, len2, m, noon_stringify, o, p, patternFunc, q, ref, ref1, ref2, ref3, regexes, rpad, s, shortb, shortf, shorts, slash, syntaxStream, t, text, textColors, v,
    indexOf = [].indexOf;

klor = require('klor');

karg = require('karg');

kolor = klor.kolor;

kolor.globalize();

NEWLINE = /\r?\n/;

rpad = function(s, l) {
    s = String(s);
    while (s.length < l) {
        s += ' ';
    }
    return s;
};

text = {
    white: 'w',
    cyan: 'c',
    magenta: 'm',
    blue: 'b',
    yellow: 'y',
    green: 'g',
    red: 'r'
};

textColors = '';

for (c in text) {
    s = text[c];
    shorts = '';
    switch (s) {
        case 'x':
        case 'z':
            break;
        default:
            for (i = j = 1; j <= 8; i = ++j) {
                shortf = s + i;
                shorts += kolor[shortf](' ' + shortf + ' ');
            }
    }
    textColors += "    " + c + "  . = false . - " + text[c] + " . ? " + (kolor[c]('██')) + (dim(kolor[c]('██'))) + shorts + "\n";
}

bgrd = {
    bgRed: 'R',
    bgGreen: 'G',
    bgYellow: 'Y',
    bgBlue: 'B',
    bgMagenta: 'M',
    bgCyan: 'C',
    bgWhite: 'W'
};

bgfunc = function(c) {
    s = bgrd[c];
    switch (s) {
        case 'Z':
            return 'W2';
        case 'W':
            return 'W4';
        default:
            return s + 4;
    }
};

bgrdColors = '';

for (c in bgrd) {
    s = bgrd[c];
    shorts = '';
    switch (s) {
        case 'W':
            for (i = m = 1; m <= 8; i = ++m) {
                shortb = 'W' + i;
                shortf = 'w'.toLowerCase() + (9 - i);
                shorts += kolor[shortf](kolor[shortb](' ' + shortb + ' '));
            }
            break;
        case 'Z':
            break;
        default:
            for (i = o = 1; o <= 8; i = ++o) {
                shortb = s + i;
                shortf = s.toLowerCase() + (9 - i);
                shorts += kolor[shortf](kolor[shortb](' ' + shortb + ' '));
            }
    }
    bgrdColors += "    " + c + "  . = false . - " + bgrd[c] + " . ? " + (reset(kolor[bgfunc(c)]("    "))) + shorts + "\n";
}

args = karg("\ncolorcat\n\n    file         . ? the file(s) to display or stdin . **\n    fat          . ? " + (gray('     bold')) + "          . = false\n    dim          . ? " + (dim(white('  ▼▼ dim'))) + "       . = false\n" + textColors + "\n" + bgrdColors + "\n    ext          . ? use syntax highlighting for *.ext\n    pattern      . ? colorize with pattern\n    patternFile  . ? colorize with patterns in file   . - P\n    skipEmpty    . ? skip empty lines                       . = false\n    lineNumbers  . ? prepend output with line numbers       . = false\n    debug                                             . - X . = false\n    \nversion   " + (require(__dirname + "/../package.json").version));

if (args.debug) {
    noon_stringify = require('noon/js/stringify');
    console.log(noon_stringify(args, {
        colors: true
    }));
}

colorize = function(str, stack) {
    var err, len, len1, n, p, q, spl;
    try {
        spl = stack.map(function(s) {
            return String(s).split('.');
        });
        spl = spl.flat();
        if (!(indexOf.call(spl, 'keep') >= 0)) {
            for (p = 0, len = spl.length; p < len; p++) {
                s = spl[p];
                if (s.substr(0, 2) === 's:') {
                    str = s.substr(2);
                    spl = spl.filter(function(s) {
                        return s.substr(0, 2) !== 's:';
                    });
                    break;
                }
            }
        }
        for (q = 0, len1 = spl.length; q < len1; q++) {
            n = spl[q];
            if (kolor[n] != null) {
                str = kolor[n](str);
            } else if (kolor[bgfunc(n)] != null) {
                str = kolor[bgfunc(n)](str);
            }
        }
    } catch (error) {
        err = error;
        console.error(err);
    }
    return str;
};

regexes = [];

clrlst = Object.assign({}, bgrd);

clrlst = Object.assign(clrlst, text);

fbgnms = kolor.FG_NAMES.concat(kolor.BG_NAMES);

fbgcol = kolor.FG_COLORS.concat(kolor.BG_COLORS);

cnames = Object.keys(text).concat(Object.keys(bgrd));

cnames = cnames.concat(fbgnms);

invert = {};

for (k in clrlst) {
    v = clrlst[k];
    invert[v] = k;
}

invert.f = 'bold';

invert.d = 'dim';

invert.k = 'keep';

invert.x = 'gray';

invert.z = 'w2';

invert.Z = 'W1';

expand = function(e) {
    var cls, expd, pat;
    expd = function(c) {
        var r, ref, ref1;
        if (ref = c[0], indexOf.call(fbgcol, ref) >= 0) {
            if (ref1 = c.slice(0, 2), indexOf.call(fbgnms, ref1) >= 0) {
                if (c.length === 2) {
                    return c;
                } else {
                    return c.slice(0, 2) + '.' + expd(c.slice(2));
                }
            }
        }
        if (((c != null ? c.split : void 0) != null) && indexOf.call(cnames, c) < 0) {
            s = c.split('s\:');
            if (invert[s[0][0]]) {
                if (s[0].length === 1) {
                    r = invert[s[0][0]];
                } else {
                    r = invert[s[0][0]] + '.' + expd(s[0].slice(1));
                }
            } else {
                r = '';
            }
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
        if (cls instanceof Array) {
            e[pat] = cls.map(function(clr) {
                return expd(clr.split('.')[0]);
            });
        } else {
            e[pat] = expd(cls);
        }
    }
    return e;
};

funkyText = function(s) {
    return s;
};

funkyBgrd = function(s) {
    return s;
};

ref = Object.keys(text);
for (p = 0, len = ref.length; p < len; p++) {
    c = ref[p];
    if (args[c]) {
        funkyText = kolor[c];
    }
}

ref1 = Object.keys(bgrd);
for (q = 0, len1 = ref1.length; q < len1; q++) {
    c = ref1[q];
    if (args[c]) {
        funkyBgrd = kolor[bgfunc(c)];
    }
}

if (args.fat) {
    fatText = function(s) {
        return bold(funkyText(s));
    };
} else {
    fatText = funkyText;
}

if (args.dim) {
    dimText = function(s) {
        return dim(fatText(s));
    };
} else {
    dimText = fatText;
}

patternFunc = function() {
    var loadSyntax, matchr, matchrConfig, noon_parse, pattern, patterns;
    loadSyntax = function(f) {
        var fs, noon_load;
        fs = require('fs');
        if (fs.existsSync(f)) {
            noon_load = require('noon/js/load');
            return expand(noon_load(f));
        } else {
            return console.error("can't locate syntax file " + f);
        }
    };
    if (args.pattern != null) {
        noon_parse = require('noon/js/parse');
        patterns = expand(noon_parse(args.pattern));
    } else if (args.patternFile != null) {
        patterns = loadSyntax(args.patternFile);
    }
    if (patterns == null) {
        return function(chunk) {
            return funkyBgrd(dimText(chunk));
        };
    }
    matchr = require('./matchr');
    matchrConfig = matchr.config(patterns);
    pattern = function(chunk) {
        var clrzd, d, di, diss, ref2, rngs, t;
        chunk = kolor.strip(chunk);
        rngs = matchr.ranges(matchrConfig, chunk);
        diss = matchr.dissect(rngs);
        if (diss.length) {
            for (di = t = ref2 = diss.length - 1; ref2 <= 0 ? t <= 0 : t >= 0; di = ref2 <= 0 ? ++t : --t) {
                d = diss[di];
                clrzd = colorize(d.match, d.stack.reverse());
                chunk = chunk.slice(0, d.start) + clrzd + chunk.slice(d.start + d.match.length);
            }
        }
        return chunk;
    };
    return pattern;
};

colorStream = function(stream, pattern) {
    var lineno;
    lineno = 0;
    return stream.on('data', function(chunk) {
        var colorLines, lines;
        lines = chunk.split('\n');
        colorLines = lines.map(function(l) {
            return pattern(l);
        });
        if (args.skipEmpty) {
            colorLines = colorLines.filter(function(l) {
                return kolor.strip(l).length > 0;
            });
        }
        if (args.lineNumbers) {
            colorLines = colorLines.map(function(l) {
                lineno += 1;
                return gray(dim(rpad("" + lineno, 6))) + l;
            });
        }
        return console.log(colorLines.join('\n'));
    });
};

syntaxStream = function(stream, ext) {
    var lineno;
    lineno = 0;
    return stream.on('data', function(chunk) {
        var colorLines, index, lines, ref2, rngs, t;
        lines = chunk.split('\n');
        colorLines = [];
        rngs = klor.dissect(lines, ext);
        for (index = t = 0, ref2 = lines.length; 0 <= ref2 ? t < ref2 : t > ref2; index = 0 <= ref2 ? ++t : --t) {
            colorLines.push(klor.kolorizeChunks({
                chunks: rngs[index],
                number: args.lineNumbers && index + 1
            }));
        }
        if (args.skipEmpty) {
            colorLines = colorLines.filter(function(l) {
                return kolor.strip(l).length > 0;
            });
        }
        return console.log(colorLines.join('\n'));
    });
};


/*
 0000000   0000000   000000000    
000       000   000     000       
000       000000000     000       
000       000   000     000       
 0000000  000   000     000
 */

if (args.file.length) {
    slash = require('kslash');
    ref2 = args.file;
    for (t = 0, len2 = ref2.length; t < len2; t++) {
        file = ref2[t];
        text = slash.readText(file);
        console.log(klor.syntax({
            text: text,
            ext: slash.ext(file),
            numbers: args.lineNumbers
        }));
    }
} else {
    process.stdin.setEncoding('utf8');
    if (args.ext && (ref3 = args.ext, indexOf.call(klor.exts, ref3) >= 0)) {
        syntaxStream(process.stdin, args.ext);
    } else {
        colorStream(process.stdin, patternFunc());
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JjYXQuanMiLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7Ozs7QUFBQSxJQUFBLG1XQUFBO0lBQUE7O0FBVUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztBQUNQLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7QUFFUCxLQUFBLEdBQVEsSUFBSSxDQUFDOztBQUNiLEtBQUssQ0FBQyxTQUFOLENBQUE7O0FBRUEsT0FBQSxHQUFVOztBQVFWLElBQUEsR0FBTyxTQUFDLENBQUQsRUFBSSxDQUFKO0lBQ0gsQ0FBQSxHQUFJLE1BQUEsQ0FBTyxDQUFQO0FBQ0osV0FBTSxDQUFDLENBQUMsTUFBRixHQUFXLENBQWpCO1FBQXdCLENBQUEsSUFBSztJQUE3QjtXQUNBO0FBSEc7O0FBS1AsSUFBQSxHQUNJO0lBQUEsS0FBQSxFQUFTLEdBQVQ7SUFDQSxJQUFBLEVBQVMsR0FEVDtJQUVBLE9BQUEsRUFBUyxHQUZUO0lBR0EsSUFBQSxFQUFTLEdBSFQ7SUFJQSxNQUFBLEVBQVMsR0FKVDtJQUtBLEtBQUEsRUFBUyxHQUxUO0lBTUEsR0FBQSxFQUFTLEdBTlQ7OztBQVFKLFVBQUEsR0FBYTs7QUFDYixLQUFBLFNBQUE7O0lBRUksTUFBQSxHQUFTO0FBQ1QsWUFBTyxDQUFQO0FBQUEsYUFDUyxHQURUO0FBQUEsYUFDWSxHQURaO0FBQ1k7QUFEWjtBQUdRLGlCQUFTLDBCQUFUO2dCQUNJLE1BQUEsR0FBUyxDQUFBLEdBQUU7Z0JBQ1gsTUFBQSxJQUFVLEtBQU0sQ0FBQSxNQUFBLENBQU4sQ0FBYyxHQUFBLEdBQU0sTUFBTixHQUFlLEdBQTdCO0FBRmQ7QUFIUjtJQU9BLFVBQUEsSUFBYyxNQUFBLEdBQU8sQ0FBUCxHQUFTLGtCQUFULEdBQTJCLElBQUssQ0FBQSxDQUFBLENBQWhDLEdBQW1DLE9BQW5DLEdBQXlDLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBTixDQUFTLElBQVQsQ0FBRCxDQUF6QyxH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QUFaLENBRnNCO0FBRjlCLEtBSko7Q0FBQSxNQUFBO0lBWUksT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFkLENBQTBCLE1BQTFCO0lBRUEsSUFBRyxJQUFJLENBQUMsR0FBTCxJQUFhLFFBQUEsSUFBSSxDQUFDLEdBQUwsRUFBQSxhQUFZLElBQUksQ0FBQyxJQUFqQixFQUFBLElBQUEsTUFBQSxDQUFoQjtRQUNJLFlBQUEsQ0FBYSxPQUFPLENBQUMsS0FBckIsRUFBNEIsSUFBSSxDQUFDLEdBQWpDLEVBREo7S0FBQSxNQUFBO1FBR0ksV0FBQSxDQUFZLE9BQU8sQ0FBQyxLQUFwQixFQUEyQixXQUFBLENBQUEsQ0FBM0IsRUFISjtLQWRKIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwICAgICAgIDAwMDAwMDAwMCAgICAgMDAwICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jIyNcblxuIyDilrhzdGFydCAnY29sb3JjYXQnXG5cbmtsb3IgPSByZXF1aXJlICdrbG9yJ1xua2FyZyA9IHJlcXVpcmUgJ2thcmcnXG5cbmtvbG9yID0ga2xvci5rb2xvclxua29sb3IuZ2xvYmFsaXplKClcblxuTkVXTElORSA9IC9cXHI/XFxuL1xuXG4jICAwMDAwMDAwICAgMDAwMDAwMDAgICAgMDAwMDAwMCAgICAwMDAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgXG4jIDAwMDAwMDAwMCAgMDAwMDAwMCAgICAwMDAgIDAwMDAgIDAwMDAwMDAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgXG5cbnJwYWQgPSAocywgbCkgLT5cbiAgICBzID0gU3RyaW5nIHNcbiAgICB3aGlsZSBzLmxlbmd0aCA8IGwgdGhlbiBzICs9ICcgJ1xuICAgIHNcblxudGV4dCA9IFxuICAgIHdoaXRlOiAgICd3J1xuICAgIGN5YW46ICAgICdjJ1xuICAgIG1hZ2VudGE6ICdtJ1xuICAgIGJsdWU6ICAgICdiJ1xuICAgIHllbGxvdzogICd5J1xuICAgIGdyZWVuOiAgICdnJ1xuICAgIHJlZDogICAgICdyJyBcbiAgICAgICAgXG50ZXh0Q29sb3JzID0gJydcbmZvciBjLHMgb2YgdGV4dFxuICAgIFxuICAgIHNob3J0cyA9ICcnXG4gICAgc3dpdGNoIHNcbiAgICAgICAgd2hlbiAneCcneicgdGhlblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmb3IgaSBpbiBbMS4uOF1cbiAgICAgICAgICAgICAgICBzaG9ydGYgPSBzK2lcbiAgICAgICAgICAgICAgICBzaG9ydHMgKz0ga29sb3Jbc2hvcnRmXSAnICcgKyBzaG9ydGYgKyAnICdcbiAgICBcbiAgICB0ZXh0Q29sb3JzICs9IFwiICAgICN7Y30gIC4gPSBmYWxzZSAuIC0gI3t0ZXh0W2NdfSAuID8gI3trb2xvcltjXSAn4paI4paIJ30je2RpbSBrb2xvcltjXSAn4paI4paIJ30je3Nob3J0c31cXG5cIlxuXG5iZ3JkID0gXG4gICAgYmdSZWQ6ICAgICAnUicgXG4gICAgYmdHcmVlbjogICAnRydcbiAgICBiZ1llbGxvdzogICdZJ1xuICAgIGJnQmx1ZTogICAgJ0InXG4gICAgYmdNYWdlbnRhOiAnTSdcbiAgICBiZ0N5YW46ICAgICdDJ1xuICAgIGJnV2hpdGU6ICAgJ1cnXG4gICAgXG5iZ2Z1bmMgPSAoYykgLT5cbiAgICBzID0gYmdyZFtjXVxuICAgIHN3aXRjaCBzXG4gICAgICAgIHdoZW4gJ1onIHRoZW4gJ1cyJ1xuICAgICAgICB3aGVuICdXJyB0aGVuICdXNCdcbiAgICAgICAgZWxzZSBzKzRcbiAgICBcbmJncmRDb2xvcnMgPSAnJ1xuZm9yIGMscyBvZiBiZ3JkXG4gICAgXG4gICAgc2hvcnRzID0gJydcbiAgICBzd2l0Y2ggc1xuICAgICAgICB3aGVuICdXJ1xuICAgICAgICAgICAgZm9yIGkgaW4gWzEuLjhdXG4gICAgICAgICAgICAgICAgc2hvcnRiID0gJ1cnK2lcbiAgICAgICAgICAgICAgICBzaG9ydGYgPSAndycudG9Mb3dlckNhc2UoKSsoOS1pKVxuICAgICAgICAgICAgICAgIHNob3J0cyArPSBrb2xvcltzaG9ydGZdIGtvbG9yW3Nob3J0Yl0gJyAnICsgc2hvcnRiICsgJyAnXG4gICAgICAgICAgICBcbiAgICAgICAgd2hlbiAnWicgdGhlblxuICAgICAgICAgICAgXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZvciBpIGluIFsxLi44XVxuICAgICAgICAgICAgICAgIHNob3J0YiA9IHMraVxuICAgICAgICAgICAgICAgIHNob3J0ZiA9IHMudG9Mb3dlckNhc2UoKSsoOS1pKVxuICAgICAgICAgICAgICAgIHNob3J0cyArPSBrb2xvcltzaG9ydGZdIGtvbG9yW3Nob3J0Yl0gJyAnICsgc2hvcnRiICsgJyAnXG4gICAgXG4gICAgYmdyZENvbG9ycyArPSBcIiAgICAje2N9ICAuID0gZmFsc2UgLiAtICN7YmdyZFtjXX0gLiA/ICN7cmVzZXQoa29sb3JbYmdmdW5jIGNdKFwiICAgIFwiKSl9I3tzaG9ydHN9XFxuXCJcbiAgICAgICAgXG5hcmdzID0ga2FyZyBcIlwiXCJcblxuY29sb3JjYXRcblxuICAgIGZpbGUgICAgICAgICAuID8gdGhlIGZpbGUocykgdG8gZGlzcGxheSBvciBzdGRpbiAuICoqXG4gICAgZmF0ICAgICAgICAgIC4gPyAjeyAgZ3JheSAnICAgICBib2xkJyB9ICAgICAgICAgIC4gPSBmYWxzZVxuICAgIGRpbSAgICAgICAgICAuID8gI3sgZGltIHdoaXRlICcgIOKWvOKWvCBkaW0nIH0gICAgICAgLiA9IGZhbHNlXG4je3RleHRDb2xvcnN9XG4je2JncmRDb2xvcnN9XG4gICAgZXh0ICAgICAgICAgIC4gPyB1c2Ugc3ludGF4IGhpZ2hsaWdodGluZyBmb3IgKi5leHRcbiAgICBwYXR0ZXJuICAgICAgLiA/IGNvbG9yaXplIHdpdGggcGF0dGVyblxuICAgIHBhdHRlcm5GaWxlICAuID8gY29sb3JpemUgd2l0aCBwYXR0ZXJucyBpbiBmaWxlICAgLiAtIFBcbiAgICBza2lwRW1wdHkgICAgLiA/IHNraXAgZW1wdHkgbGluZXMgICAgICAgICAgICAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIGxpbmVOdW1iZXJzICAuID8gcHJlcGVuZCBvdXRwdXQgd2l0aCBsaW5lIG51bWJlcnMgICAgICAgLiA9IGZhbHNlXG4gICAgZGVidWcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuIC0gWCAuID0gZmFsc2VcbiAgICBcbnZlcnNpb24gICAje3JlcXVpcmUoXCIje19fZGlybmFtZX0vLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb259XG5cIlwiXCJcblxuaWYgYXJncy5kZWJ1Z1xuICAgIG5vb25fc3RyaW5naWZ5ID0gcmVxdWlyZSAnbm9vbi9qcy9zdHJpbmdpZnknXG4gICAgbG9nIG5vb25fc3RyaW5naWZ5IGFyZ3MsIGNvbG9yczp0cnVlXG4gICAgXG4jICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIDAwMCAgIDAwMCAgICAgXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAgICAgMDAwICAgIDAwMDAwMDAgXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgXG4jICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwXG5cbmNvbG9yaXplID0gKHN0ciwgc3RhY2spIC0+XG4gICAgdHJ5XG4gICAgICAgIHNwbCA9IHN0YWNrLm1hcCAocykgLT4gU3RyaW5nKHMpLnNwbGl0ICcuJ1xuICAgICAgICBzcGwgPSBzcGwuZmxhdCgpXG5cbiAgICAgICAgaWYgbm90ICgna2VlcCcgaW4gc3BsKVxuICAgICAgICAgICAgZm9yIHMgaW4gc3BsXG4gICAgICAgICAgICAgICAgaWYgcy5zdWJzdHIoMCwyKSA9PSAnczonXG4gICAgICAgICAgICAgICAgICAgIHN0ciA9IHMuc3Vic3RyKDIpXG4gICAgICAgICAgICAgICAgICAgIHNwbCA9IHNwbC5maWx0ZXIgKHMpIC0+IHMuc3Vic3RyKDAsMikgIT0gJ3M6J1xuICAgICAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgIGZvciBuIGluIHNwbFxuICAgICAgICAgICAgaWYga29sb3Jbbl0/XG4gICAgICAgICAgICAgICAgc3RyID0ga29sb3Jbbl0gc3RyXG4gICAgICAgICAgICBlbHNlIGlmIGtvbG9yW2JnZnVuYyBuXT9cbiAgICAgICAgICAgICAgICBzdHIgPSBrb2xvcltiZ2Z1bmMgbl0gc3RyXG4gICAgY2F0Y2ggZXJyXG4gICAgICAgIGVycm9yIGVyclxuICAgIHN0clxuXG4jIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIFxuIyAwMDAgICAgICAgIDAwMCAwMDAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAwMDBcbiMgMDAwMDAwMCAgICAgMDAwMDAgICAgMDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMCAwIDAwMCAgMDAwICAgMDAwXG4jIDAwMCAgICAgICAgMDAwIDAwMCAgIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgIDAwMFxuIyAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICBcblxucmVnZXhlcyA9IFtdXG5cbmNscmxzdCA9IE9iamVjdC5hc3NpZ24ge30sIGJncmRcbmNscmxzdCA9IE9iamVjdC5hc3NpZ24gY2xybHN0LCB0ZXh0XG5mYmdubXMgPSBrb2xvci5GR19OQU1FUy5jb25jYXQga29sb3IuQkdfTkFNRVNcbmZiZ2NvbCA9IGtvbG9yLkZHX0NPTE9SUy5jb25jYXQga29sb3IuQkdfQ09MT1JTXG5jbmFtZXMgPSBPYmplY3Qua2V5cyh0ZXh0KS5jb25jYXQgT2JqZWN0LmtleXMoYmdyZClcbmNuYW1lcyA9IGNuYW1lcy5jb25jYXQgZmJnbm1zXG5pbnZlcnQgPSB7fVxuZm9yIGssdiBvZiBjbHJsc3QgdGhlbiBpbnZlcnRbdl0gPSBrXG5pbnZlcnQuZiA9ICdib2xkJ1xuaW52ZXJ0LmQgPSAnZGltJ1xuaW52ZXJ0LmsgPSAna2VlcCdcbmludmVydC54ID0gJ2dyYXknXG5pbnZlcnQueiA9ICd3MidcbmludmVydC5aID0gJ1cxJ1xuXG5leHBhbmQgPSAoZSkgLT5cbiAgICBcbiAgICBleHBkID0gKGMpIC0+XG4gICAgICAgIGlmIGNbMF0gaW4gZmJnY29sXG4gICAgICAgICAgICBpZiBjWzAuLjFdIGluIGZiZ25tc1xuICAgICAgICAgICAgICAgIGlmIGMubGVuZ3RoID09IDIgdGhlbiByZXR1cm4gY1xuICAgICAgICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICByZXR1cm4gY1swLi4xXSArICcuJyArIGV4cGQgY1syLi5dXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIGM/LnNwbGl0PyBhbmQgYyBub3QgaW4gY25hbWVzXG4gICAgICAgICAgICBzID0gYy5zcGxpdCAnc1xcOidcbiAgICAgICAgICAgIGlmIGludmVydFtzWzBdWzBdXVxuICAgICAgICAgICAgICAgIGlmIHNbMF0ubGVuZ3RoID09IDEgdGhlbiByID0gaW52ZXJ0W3NbMF1bMF1dXG4gICAgICAgICAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgIHIgPSBpbnZlcnRbc1swXVswXV0gKyAnLicgKyBleHBkIHNbMF1bMS4uXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICMgZXJyb3IgJ2RhZnVrPycsIGMsIHNcbiAgICAgICAgICAgICAgICByID0gJydcbiAgICAgICAgICAgIHIgKz0gJy5zOicgKyBzWzFdIGlmIHMubGVuZ3RoID4gMVxuICAgICAgICAgICAgclxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjXG4gICAgXG4gICAgZm9yIHBhdCxjbHMgb2YgZVxuICAgICAgICBpZiBjbHMgaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICAgICAgZVtwYXRdID0gY2xzLm1hcCAoY2xyKSAtPiBleHBkIGNsci5zcGxpdCgnLicpWzBdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGVbcGF0XSA9IGV4cGQgY2xzXG4gICAgZSBcblxuIyAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAwMDAgICAgMDAwIDAwMCBcbiMgMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAwMDAwICAgICAgMDAwMDAgIFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgICAgMDAwICAgXG4jIDAwMCAgICAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcblxuZnVua3lUZXh0ID0gKHMpIC0+IHNcbmZ1bmt5QmdyZCA9IChzKSAtPiBzXG5cbmZvciBjIGluIE9iamVjdC5rZXlzIHRleHRcbiAgICBpZiBhcmdzW2NdXG4gICAgICAgIGZ1bmt5VGV4dCA9IGtvbG9yW2NdXG4gICAgICAgIFxuZm9yIGMgaW4gT2JqZWN0LmtleXMgYmdyZFxuICAgIGlmIGFyZ3NbY11cbiAgICAgICAgZnVua3lCZ3JkID0ga29sb3JbYmdmdW5jIGNdXG5cbmlmIGFyZ3MuZmF0XG4gICAgZmF0VGV4dCA9IChzKSAtPiBib2xkIGZ1bmt5VGV4dCBzXG5lbHNlXG4gICAgZmF0VGV4dCA9IGZ1bmt5VGV4dFxuXG5pZiBhcmdzLmRpbVxuICAgIGRpbVRleHQgPSAocykgLT4gZGltIGZhdFRleHQgc1xuZWxzZVxuICAgIGRpbVRleHQgPSBmYXRUZXh0XG5cbiMgMDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgIFxuIyAwMDAwMDAwMCAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAgICAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMCAwIDAwMCAgMDAwMDAwMCBcbiMgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgIDAwMDAgICAgICAgMDAwXG4jIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICAgICAgIDAwMCAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwIFxuXG5wYXR0ZXJuRnVuYyA9IC0+XG4gICAgXG4gICAgbG9hZFN5bnRheCA9IChmKSAtPlxuICAgICAgICBmcyA9IHJlcXVpcmUgJ2ZzJ1xuICAgICAgICBpZiBmcy5leGlzdHNTeW5jIGZcbiAgICAgICAgICAgIG5vb25fbG9hZCA9IHJlcXVpcmUgJ25vb24vanMvbG9hZCdcbiAgICAgICAgICAgIGV4cGFuZCBub29uX2xvYWQgZiBcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZXJyb3IgXCJjYW4ndCBsb2NhdGUgc3ludGF4IGZpbGUgI3tmfVwiXG4gICAgXG4gICAgaWYgYXJncy5wYXR0ZXJuP1xuICAgICAgICBub29uX3BhcnNlID0gcmVxdWlyZSAnbm9vbi9qcy9wYXJzZSdcbiAgICAgICAgcGF0dGVybnMgPSBleHBhbmQgbm9vbl9wYXJzZSBhcmdzLnBhdHRlcm5cbiAgICAgICAgIyBsb2cgcGF0dGVybnNcbiAgICBlbHNlIGlmIGFyZ3MucGF0dGVybkZpbGU/XG4gICAgICAgIHBhdHRlcm5zID0gbG9hZFN5bnRheCBhcmdzLnBhdHRlcm5GaWxlXG4gICAgXG4gICAgaWYgbm90IHBhdHRlcm5zP1xuICAgICAgICByZXR1cm4gKGNodW5rKSAtPiBmdW5reUJncmQgZGltVGV4dCBjaHVua1xuICAgICAgICBcbiAgICBtYXRjaHIgPSByZXF1aXJlICcuL21hdGNocidcbiAgICBtYXRjaHJDb25maWcgPSBtYXRjaHIuY29uZmlnIHBhdHRlcm5zXG4gICAgICAgICAgXG4gICAgcGF0dGVybiA9IChjaHVuaykgLT5cbiAgICAgICAgY2h1bmsgPSBrb2xvci5zdHJpcCBjaHVua1xuICAgICAgICBybmdzID0gbWF0Y2hyLnJhbmdlcyBtYXRjaHJDb25maWcsIGNodW5rXG4gICAgICAgIGRpc3MgPSBtYXRjaHIuZGlzc2VjdCBybmdzXG4gICAgICAgIFxuICAgICAgICBpZiBkaXNzLmxlbmd0aFxuICAgICAgICAgICAgZm9yIGRpIGluIFtkaXNzLmxlbmd0aC0xLi4wXVxuICAgICAgICAgICAgICAgIGQgPSBkaXNzW2RpXVxuICAgICAgICAgICAgICAgIGNscnpkID0gY29sb3JpemUgZC5tYXRjaCwgZC5zdGFjay5yZXZlcnNlKClcbiAgICAgICAgICAgICAgICBjaHVuayA9IGNodW5rLnNsaWNlKDAsIGQuc3RhcnQpICsgY2xyemQgKyBjaHVuay5zbGljZShkLnN0YXJ0K2QubWF0Y2gubGVuZ3RoKVxuICAgICAgICBjaHVua1xuICAgICAgICBcbiAgICByZXR1cm4gcGF0dGVyblxuXG4jICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAgICAgIDAwXG4jIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDAwXG4jICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4jIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG5cbmNvbG9yU3RyZWFtID0gKHN0cmVhbSwgcGF0dGVybikgLT5cbiAgICBcbiAgICBsaW5lbm8gPSAwXG4gICAgc3RyZWFtLm9uICdkYXRhJywgKGNodW5rKSAtPlxuICAgICAgICBcbiAgICAgICAgbGluZXMgPSBjaHVuay5zcGxpdCAnXFxuJ1xuICAgICAgICBjb2xvckxpbmVzID0gbGluZXMubWFwIChsKSAtPiBwYXR0ZXJuIGxcbiAgICAgICAgXG4gICAgICAgIGlmIGFyZ3Muc2tpcEVtcHR5XG4gICAgICAgICAgICBjb2xvckxpbmVzID0gY29sb3JMaW5lcy5maWx0ZXIgKGwpIC0+IFxuICAgICAgICAgICAgICAgIGtvbG9yLnN0cmlwKGwpLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgaWYgYXJncy5saW5lTnVtYmVyc1xuICAgICAgICAgICAgY29sb3JMaW5lcyA9IGNvbG9yTGluZXMubWFwIChsKSAtPiBcbiAgICAgICAgICAgICAgICBsaW5lbm8gKz0gMVxuICAgICAgICAgICAgICAgIHJldHVybiBncmF5KGRpbSBycGFkKFwiI3tsaW5lbm99XCIsNikpICsgbFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBsb2cgY29sb3JMaW5lcy5qb2luICdcXG4nXG4gICAgICAgIFxuc3ludGF4U3RyZWFtID0gKHN0cmVhbSwgZXh0KSAtPlxuXG4gICAgbGluZW5vID0gMFxuICAgIHN0cmVhbS5vbiAnZGF0YScsIChjaHVuaykgLT5cbiAgICAgICAgXG4gICAgICAgIGxpbmVzID0gY2h1bmsuc3BsaXQgJ1xcbidcbiAgICAgICAgY29sb3JMaW5lcyA9IFtdXG4gICAgICAgIFxuICAgICAgICBybmdzID0ga2xvci5kaXNzZWN0IGxpbmVzLCBleHRcbiAgICAgICAgZm9yIGluZGV4IGluIFswLi4ubGluZXMubGVuZ3RoXVxuICAgICAgICAgICAgY29sb3JMaW5lcy5wdXNoIGtsb3Iua29sb3JpemVDaHVua3MgY2h1bmtzOnJuZ3NbaW5kZXhdLCBudW1iZXI6YXJncy5saW5lTnVtYmVycyBhbmQgaW5kZXgrMVxuICAgICAgICBcbiAgICAgICAgaWYgYXJncy5za2lwRW1wdHlcbiAgICAgICAgICAgIGNvbG9yTGluZXMgPSBjb2xvckxpbmVzLmZpbHRlciAobCkgLT4gXG4gICAgICAgICAgICAgICAga29sb3Iuc3RyaXAobCkubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgIFxuICAgICAgICBsb2cgY29sb3JMaW5lcy5qb2luICdcXG4nXG4gICAgXG4jIyNcbiAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgICBcbjAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgICBcbjAwMCAgICAgICAwMDAwMDAwMDAgICAgIDAwMCAgICAgICBcbjAwMCAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgICBcbiAwMDAwMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgICBcbiMjI1xuICAgIFxuaWYgYXJncy5maWxlLmxlbmd0aFxuICBcbiAgICBzbGFzaCA9IHJlcXVpcmUgJ2tzbGFzaCdcbiAgICBcbiAgICBmb3IgZmlsZSBpbiBhcmdzLmZpbGUgICAgXG5cbiAgICAgICAgdGV4dCA9IHNsYXNoLnJlYWRUZXh0IGZpbGVcbiAgXG4gICAgICAgIGxvZyBrbG9yLnN5bnRheCB0ZXh0OnRleHQsIGV4dDpzbGFzaC5leHQoZmlsZSksIG51bWJlcnM6YXJncy5saW5lTnVtYmVyc1xuICAgICAgICAgICAgICAgIFxuZWxzZVxuICAgIFxuICAgIHByb2Nlc3Muc3RkaW4uc2V0RW5jb2RpbmcgJ3V0ZjgnXG4gICAgXG4gICAgaWYgYXJncy5leHQgYW5kIGFyZ3MuZXh0IGluIGtsb3IuZXh0c1xuICAgICAgICBzeW50YXhTdHJlYW0gcHJvY2Vzcy5zdGRpbiwgYXJncy5leHRcbiAgICBlbHNlICAgIFxuICAgICAgICBjb2xvclN0cmVhbSBwcm9jZXNzLnN0ZGluLCBwYXR0ZXJuRnVuYygpXG5cbiMgcHJvY2Vzcy5vbiAnZXhpdCcsIChjb2RlKSAtPiDilrhlbmQgJ2NvbG9yY2F0J1xuIl19
//# sourceURL=../coffee/colorcat.coffee