// koffee 1.19.0

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
    var buffer, lineno;
    lineno = 0;
    buffer = '';
    return stream.on('data', function(chunk) {
        var colorLines, lines;
        if (!chunk.endsWith('\n')) {
            buffer += chunk;
            return;
        }
        lines = (buffer + chunk).split('\n');
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
        console.log(colorLines.join('\n'));
        return buffer = '';
    });
};

syntaxStream = function(stream, ext) {
    var buffer, lineno;
    lineno = 0;
    buffer = '';
    return stream.on('data', function(chunk) {
        var colorLines, index, lines, ref2, rngs, t;
        if (!chunk.endsWith('\n')) {
            buffer += chunk;
            return;
        }
        lines = (buffer + chunk).split('\n');
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
        console.log(colorLines.join('\n'));
        return buffer = '';
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sb3JjYXQuanMiLCJzb3VyY2VSb290IjoiLi4vY29mZmVlIiwic291cmNlcyI6WyJjb2xvcmNhdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7OztBQUFBLElBQUEsbVdBQUE7SUFBQTs7QUFVQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0FBQ1AsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztBQUVQLEtBQUEsR0FBUSxJQUFJLENBQUM7O0FBQ2IsS0FBSyxDQUFDLFNBQU4sQ0FBQTs7QUFFQSxPQUFBLEdBQVU7O0FBUVYsSUFBQSxHQUFPLFNBQUMsQ0FBRCxFQUFJLENBQUo7SUFDSCxDQUFBLEdBQUksTUFBQSxDQUFPLENBQVA7QUFDSixXQUFNLENBQUMsQ0FBQyxNQUFGLEdBQVcsQ0FBakI7UUFBd0IsQ0FBQSxJQUFLO0lBQTdCO1dBQ0E7QUFIRzs7QUFLUCxJQUFBLEdBQ0k7SUFBQSxLQUFBLEVBQVMsR0FBVDtJQUNBLElBQUEsRUFBUyxHQURUO0lBRUEsT0FBQSxFQUFTLEdBRlQ7SUFHQSxJQUFBLEVBQVMsR0FIVDtJQUlBLE1BQUEsRUFBUyxHQUpUO0lBS0EsS0FBQSxFQUFTLEdBTFQ7SUFNQSxHQUFBLEVBQVMsR0FOVDs7O0FBUUosVUFBQSxHQUFhOztBQUNiLEtBQUEsU0FBQTs7SUFFSSxNQUFBLEdBQVM7QUFDVCxZQUFPLENBQVA7QUFBQSxhQUNTLEdBRFQ7QUFBQSxhQUNZLEdBRFo7QUFDWTtBQURaO0FBR1EsaUJBQVMsMEJBQVQ7Z0JBQ0ksTUFBQSxHQUFTLENBQUEsR0FBRTtnQkFDWCxNQUFBLElBQVUsS0FBTSxDQUFBLE1BQUEsQ0FBTixDQUFjLEdBQUEsR0FBTSxNQUFOLEdBQWUsR0FBN0I7QUFGZDtBQUhSO0lBT0EsVUFBQSxJQUFjLE1BQUEsR0FBTyxDQUFQLEdBQVMsa0JBQVQsR0FBMkIsSUFBSyxDQUFBLENBQUEsQ0FBaEMsR0FBbUMsT0FBbkMsR0FBeUMsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFO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QVFBLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFiO0lBRUksS0FBQSxHQUFRLE9BQUEsQ0FBUSxRQUFSO0FBRVI7QUFBQSxTQUFBLHdDQUFBOztRQUVJLElBQUEsR0FBTyxLQUFLLENBQUMsUUFBTixDQUFlLElBQWY7UUFBbUIsT0FBQSxDQUUxQixHQUYwQixDQUV0QixJQUFJLENBQUMsTUFBTCxDQUFZO1lBQUEsSUFBQSxFQUFLLElBQUw7WUFBVyxHQUFBLEVBQUksS0FBSyxDQUFDLEdBQU4sQ0FBVSxJQUFWLENBQWY7WUFBZ0MsT0FBQSxFQUFRLElBQUksQ0FBQyxXQUE3QztTQUFaLENBRnNCO0FBRjlCLEtBSko7Q0FBQSxNQUFBO0lBWUksT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFkLENBQTBCLE1BQTFCO0lBRUEsSUFBRyxJQUFJLENBQUMsR0FBTCxJQUFhLFFBQUEsSUFBSSxDQUFDLEdBQUwsRUFBQSxhQUFZLElBQUksQ0FBQyxJQUFqQixFQUFBLElBQUEsTUFBQSxDQUFoQjtRQUNJLFlBQUEsQ0FBYSxPQUFPLENBQUMsS0FBckIsRUFBNEIsSUFBSSxDQUFDLEdBQWpDLEVBREo7S0FBQSxNQUFBO1FBR0ksV0FBQSxDQUFZLE9BQU8sQ0FBQyxLQUFwQixFQUEyQixXQUFBLENBQUEsQ0FBM0IsRUFISjtLQWRKIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAgICAgICAgMDAwMDAwMCAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMDAwMDAgICAgMDAwICAgICAgIDAwMDAwMDAwMCAgICAgMDAwICAgXG4wMDAgICAgICAgMDAwICAgMDAwICAwMDAgICAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4gMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgIDAwMDAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgXG4jIyNcblxuIyDilrhzdGFydCAnY29sb3JjYXQnXG5cbmtsb3IgPSByZXF1aXJlICdrbG9yJ1xua2FyZyA9IHJlcXVpcmUgJ2thcmcnXG5cbmtvbG9yID0ga2xvci5rb2xvclxua29sb3IuZ2xvYmFsaXplKClcblxuTkVXTElORSA9IC9cXHI/XFxuL1xuXG4jICAwMDAwMDAwICAgMDAwMDAwMDAgICAgMDAwMDAwMCAgICAwMDAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgICAgXG4jIDAwMDAwMDAwMCAgMDAwMDAwMCAgICAwMDAgIDAwMDAgIDAwMDAwMDAgXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgICAgMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgXG5cbnJwYWQgPSAocywgbCkgLT5cbiAgICBzID0gU3RyaW5nIHNcbiAgICB3aGlsZSBzLmxlbmd0aCA8IGwgdGhlbiBzICs9ICcgJ1xuICAgIHNcblxudGV4dCA9IFxuICAgIHdoaXRlOiAgICd3J1xuICAgIGN5YW46ICAgICdjJ1xuICAgIG1hZ2VudGE6ICdtJ1xuICAgIGJsdWU6ICAgICdiJ1xuICAgIHllbGxvdzogICd5J1xuICAgIGdyZWVuOiAgICdnJ1xuICAgIHJlZDogICAgICdyJyBcbiAgICAgICAgXG50ZXh0Q29sb3JzID0gJydcbmZvciBjLHMgb2YgdGV4dFxuICAgIFxuICAgIHNob3J0cyA9ICcnXG4gICAgc3dpdGNoIHNcbiAgICAgICAgd2hlbiAneCcneicgdGhlblxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmb3IgaSBpbiBbMS4uOF1cbiAgICAgICAgICAgICAgICBzaG9ydGYgPSBzK2lcbiAgICAgICAgICAgICAgICBzaG9ydHMgKz0ga29sb3Jbc2hvcnRmXSAnICcgKyBzaG9ydGYgKyAnICdcbiAgICBcbiAgICB0ZXh0Q29sb3JzICs9IFwiICAgICN7Y30gIC4gPSBmYWxzZSAuIC0gI3t0ZXh0W2NdfSAuID8gI3trb2xvcltjXSAn4paI4paIJ30je2RpbSBrb2xvcltjXSAn4paI4paIJ30je3Nob3J0c31cXG5cIlxuXG5iZ3JkID0gXG4gICAgYmdSZWQ6ICAgICAnUicgXG4gICAgYmdHcmVlbjogICAnRydcbiAgICBiZ1llbGxvdzogICdZJ1xuICAgIGJnQmx1ZTogICAgJ0InXG4gICAgYmdNYWdlbnRhOiAnTSdcbiAgICBiZ0N5YW46ICAgICdDJ1xuICAgIGJnV2hpdGU6ICAgJ1cnXG4gICAgXG5iZ2Z1bmMgPSAoYykgLT5cbiAgICBzID0gYmdyZFtjXVxuICAgIHN3aXRjaCBzXG4gICAgICAgIHdoZW4gJ1onIHRoZW4gJ1cyJ1xuICAgICAgICB3aGVuICdXJyB0aGVuICdXNCdcbiAgICAgICAgZWxzZSBzKzRcbiAgICBcbmJncmRDb2xvcnMgPSAnJ1xuZm9yIGMscyBvZiBiZ3JkXG4gICAgXG4gICAgc2hvcnRzID0gJydcbiAgICBzd2l0Y2ggc1xuICAgICAgICB3aGVuICdXJ1xuICAgICAgICAgICAgZm9yIGkgaW4gWzEuLjhdXG4gICAgICAgICAgICAgICAgc2hvcnRiID0gJ1cnK2lcbiAgICAgICAgICAgICAgICBzaG9ydGYgPSAndycudG9Mb3dlckNhc2UoKSsoOS1pKVxuICAgICAgICAgICAgICAgIHNob3J0cyArPSBrb2xvcltzaG9ydGZdIGtvbG9yW3Nob3J0Yl0gJyAnICsgc2hvcnRiICsgJyAnXG4gICAgICAgICAgICBcbiAgICAgICAgd2hlbiAnWicgdGhlblxuICAgICAgICAgICAgXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZvciBpIGluIFsxLi44XVxuICAgICAgICAgICAgICAgIHNob3J0YiA9IHMraVxuICAgICAgICAgICAgICAgIHNob3J0ZiA9IHMudG9Mb3dlckNhc2UoKSsoOS1pKVxuICAgICAgICAgICAgICAgIHNob3J0cyArPSBrb2xvcltzaG9ydGZdIGtvbG9yW3Nob3J0Yl0gJyAnICsgc2hvcnRiICsgJyAnXG4gICAgXG4gICAgYmdyZENvbG9ycyArPSBcIiAgICAje2N9ICAuID0gZmFsc2UgLiAtICN7YmdyZFtjXX0gLiA/ICN7cmVzZXQoa29sb3JbYmdmdW5jIGNdKFwiICAgIFwiKSl9I3tzaG9ydHN9XFxuXCJcbiAgICAgICAgXG5hcmdzID0ga2FyZyBcIlwiXCJcblxuY29sb3JjYXRcblxuICAgIGZpbGUgICAgICAgICAuID8gdGhlIGZpbGUocykgdG8gZGlzcGxheSBvciBzdGRpbiAuICoqXG4gICAgZmF0ICAgICAgICAgIC4gPyAjeyAgZ3JheSAnICAgICBib2xkJyB9ICAgICAgICAgIC4gPSBmYWxzZVxuICAgIGRpbSAgICAgICAgICAuID8gI3sgZGltIHdoaXRlICcgIOKWvOKWvCBkaW0nIH0gICAgICAgLiA9IGZhbHNlXG4je3RleHRDb2xvcnN9XG4je2JncmRDb2xvcnN9XG4gICAgZXh0ICAgICAgICAgIC4gPyB1c2Ugc3ludGF4IGhpZ2hsaWdodGluZyBmb3IgKi5leHRcbiAgICBwYXR0ZXJuICAgICAgLiA/IGNvbG9yaXplIHdpdGggcGF0dGVyblxuICAgIHBhdHRlcm5GaWxlICAuID8gY29sb3JpemUgd2l0aCBwYXR0ZXJucyBpbiBmaWxlICAgLiAtIFBcbiAgICBza2lwRW1wdHkgICAgLiA/IHNraXAgZW1wdHkgbGluZXMgICAgICAgICAgICAgICAgICAgICAgIC4gPSBmYWxzZVxuICAgIGxpbmVOdW1iZXJzICAuID8gcHJlcGVuZCBvdXRwdXQgd2l0aCBsaW5lIG51bWJlcnMgICAgICAgLiA9IGZhbHNlXG4gICAgZGVidWcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuIC0gWCAuID0gZmFsc2VcbiAgICBcbnZlcnNpb24gICAje3JlcXVpcmUoXCIje19fZGlybmFtZX0vLi4vcGFja2FnZS5qc29uXCIpLnZlcnNpb259XG5cIlwiXCJcblxuaWYgYXJncy5kZWJ1Z1xuICAgIG5vb25fc3RyaW5naWZ5ID0gcmVxdWlyZSAnbm9vbi9qcy9zdHJpbmdpZnknXG4gICAgbG9nIG5vb25fc3RyaW5naWZ5IGFyZ3MsIGNvbG9yczp0cnVlXG4gICAgXG4jICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMCAgICAgICAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAgIDAwMCAgIDAwMCAgICAgXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMCAgICAwMDAgICAgMDAwICAgIDAwMDAwMDAgXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMCAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgICAgIDAwMCAgICAgXG4jICAwMDAwMDAwICAgMDAwMDAwMCAgIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwICAgMDAwICAwMDAgIDAwMDAwMDAgIDAwMDAwMDAwXG5cbmNvbG9yaXplID0gKHN0ciwgc3RhY2spIC0+XG4gICAgdHJ5XG4gICAgICAgIHNwbCA9IHN0YWNrLm1hcCAocykgLT4gU3RyaW5nKHMpLnNwbGl0ICcuJ1xuICAgICAgICBzcGwgPSBzcGwuZmxhdCgpXG5cbiAgICAgICAgaWYgbm90ICgna2VlcCcgaW4gc3BsKVxuICAgICAgICAgICAgZm9yIHMgaW4gc3BsXG4gICAgICAgICAgICAgICAgaWYgcy5zdWJzdHIoMCwyKSA9PSAnczonXG4gICAgICAgICAgICAgICAgICAgIHN0ciA9IHMuc3Vic3RyKDIpXG4gICAgICAgICAgICAgICAgICAgIHNwbCA9IHNwbC5maWx0ZXIgKHMpIC0+IHMuc3Vic3RyKDAsMikgIT0gJ3M6J1xuICAgICAgICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgIGZvciBuIGluIHNwbFxuICAgICAgICAgICAgaWYga29sb3Jbbl0/XG4gICAgICAgICAgICAgICAgc3RyID0ga29sb3Jbbl0gc3RyXG4gICAgICAgICAgICBlbHNlIGlmIGtvbG9yW2JnZnVuYyBuXT9cbiAgICAgICAgICAgICAgICBzdHIgPSBrb2xvcltiZ2Z1bmMgbl0gc3RyXG4gICAgY2F0Y2ggZXJyXG4gICAgICAgIGVycm9yIGVyclxuICAgIHN0clxuXG4jIDAwMDAwMDAwICAwMDAgICAwMDAgIDAwMDAwMDAwICAgIDAwMDAwMDAgICAwMDAgICAwMDAgIDAwMDAwMDAgIFxuIyAwMDAgICAgICAgIDAwMCAwMDAgICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAwMDBcbiMgMDAwMDAwMCAgICAgMDAwMDAgICAgMDAwMDAwMDAgICAwMDAwMDAwMDAgIDAwMCAwIDAwMCAgMDAwICAgMDAwXG4jIDAwMCAgICAgICAgMDAwIDAwMCAgIDAwMCAgICAgICAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgIDAwMFxuIyAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwICBcblxucmVnZXhlcyA9IFtdXG5cbmNscmxzdCA9IE9iamVjdC5hc3NpZ24ge30sIGJncmRcbmNscmxzdCA9IE9iamVjdC5hc3NpZ24gY2xybHN0LCB0ZXh0XG5mYmdubXMgPSBrb2xvci5GR19OQU1FUy5jb25jYXQga29sb3IuQkdfTkFNRVNcbmZiZ2NvbCA9IGtvbG9yLkZHX0NPTE9SUy5jb25jYXQga29sb3IuQkdfQ09MT1JTXG5jbmFtZXMgPSBPYmplY3Qua2V5cyh0ZXh0KS5jb25jYXQgT2JqZWN0LmtleXMoYmdyZClcbmNuYW1lcyA9IGNuYW1lcy5jb25jYXQgZmJnbm1zXG5pbnZlcnQgPSB7fVxuZm9yIGssdiBvZiBjbHJsc3QgdGhlbiBpbnZlcnRbdl0gPSBrXG5pbnZlcnQuZiA9ICdib2xkJ1xuaW52ZXJ0LmQgPSAnZGltJ1xuaW52ZXJ0LmsgPSAna2VlcCdcbmludmVydC54ID0gJ2dyYXknXG5pbnZlcnQueiA9ICd3MidcbmludmVydC5aID0gJ1cxJ1xuXG5leHBhbmQgPSAoZSkgLT5cbiAgICBcbiAgICBleHBkID0gKGMpIC0+XG4gICAgICAgIGlmIGNbMF0gaW4gZmJnY29sXG4gICAgICAgICAgICBpZiBjWzAuLjFdIGluIGZiZ25tc1xuICAgICAgICAgICAgICAgIGlmIGMubGVuZ3RoID09IDIgdGhlbiByZXR1cm4gY1xuICAgICAgICAgICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICByZXR1cm4gY1swLi4xXSArICcuJyArIGV4cGQgY1syLi5dXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIGM/LnNwbGl0PyBhbmQgYyBub3QgaW4gY25hbWVzXG4gICAgICAgICAgICBzID0gYy5zcGxpdCAnc1xcOidcbiAgICAgICAgICAgIGlmIGludmVydFtzWzBdWzBdXVxuICAgICAgICAgICAgICAgIGlmIHNbMF0ubGVuZ3RoID09IDEgdGhlbiByID0gaW52ZXJ0W3NbMF1bMF1dXG4gICAgICAgICAgICAgICAgZWxzZSAgICAgICAgICAgICAgICAgICAgIHIgPSBpbnZlcnRbc1swXVswXV0gKyAnLicgKyBleHBkIHNbMF1bMS4uXVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICMgZXJyb3IgJ2RhZnVrPycsIGMsIHNcbiAgICAgICAgICAgICAgICByID0gJydcbiAgICAgICAgICAgIHIgKz0gJy5zOicgKyBzWzFdIGlmIHMubGVuZ3RoID4gMVxuICAgICAgICAgICAgclxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjXG4gICAgXG4gICAgZm9yIHBhdCxjbHMgb2YgZVxuICAgICAgICBpZiBjbHMgaW5zdGFuY2VvZiBBcnJheVxuICAgICAgICAgICAgZVtwYXRdID0gY2xzLm1hcCAoY2xyKSAtPiBleHBkIGNsci5zcGxpdCgnLicpWzBdXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGVbcGF0XSA9IGV4cGQgY2xzXG4gICAgZSBcblxuIyAwMDAwMDAwMCAgMDAwICAgMDAwICAwMDAgICAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jIDAwMCAgICAgICAwMDAgICAwMDAgIDAwMDAgIDAwMCAgMDAwICAwMDAgICAgMDAwIDAwMCBcbiMgMDAwMDAwICAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwICAwMDAwMDAwICAgICAgMDAwMDAgIFxuIyAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgIDAwMDAgIDAwMCAgMDAwICAgICAgMDAwICAgXG4jIDAwMCAgICAgICAgMDAwMDAwMCAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICBcblxuZnVua3lUZXh0ID0gKHMpIC0+IHNcbmZ1bmt5QmdyZCA9IChzKSAtPiBzXG5cbmZvciBjIGluIE9iamVjdC5rZXlzIHRleHRcbiAgICBpZiBhcmdzW2NdXG4gICAgICAgIGZ1bmt5VGV4dCA9IGtvbG9yW2NdXG4gICAgICAgIFxuZm9yIGMgaW4gT2JqZWN0LmtleXMgYmdyZFxuICAgIGlmIGFyZ3NbY11cbiAgICAgICAgZnVua3lCZ3JkID0ga29sb3JbYmdmdW5jIGNdXG5cbmlmIGFyZ3MuZmF0XG4gICAgZmF0VGV4dCA9IChzKSAtPiBib2xkIGZ1bmt5VGV4dCBzXG5lbHNlXG4gICAgZmF0VGV4dCA9IGZ1bmt5VGV4dFxuXG5pZiBhcmdzLmRpbVxuICAgIGRpbVRleHQgPSAocykgLT4gZGltIGZhdFRleHQgc1xuZWxzZVxuICAgIGRpbVRleHQgPSBmYXRUZXh0XG5cbiMgMDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDAwICAwMDAwMDAwMCAgMDAwMDAwMDAgICAwMDAgICAwMDAgICAwMDAwMDAwXG4jIDAwMCAgIDAwMCAgMDAwICAgMDAwICAgICAwMDAgICAgICAgIDAwMCAgICAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwMCAgMDAwICAwMDAgICAgIFxuIyAwMDAwMDAwMCAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAgICAwMDAgICAgIDAwMDAwMDAgICAwMDAwMDAwICAgIDAwMCAwIDAwMCAgMDAwMDAwMCBcbiMgMDAwICAgICAgICAwMDAgICAwMDAgICAgIDAwMCAgICAgICAgMDAwICAgICAwMDAgICAgICAgMDAwICAgMDAwICAwMDAgIDAwMDAgICAgICAgMDAwXG4jIDAwMCAgICAgICAgMDAwICAgMDAwICAgICAwMDAgICAgICAgIDAwMCAgICAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwICAwMDAwMDAwIFxuXG5wYXR0ZXJuRnVuYyA9IC0+XG4gICAgXG4gICAgbG9hZFN5bnRheCA9IChmKSAtPlxuICAgICAgICBmcyA9IHJlcXVpcmUgJ2ZzJ1xuICAgICAgICBpZiBmcy5leGlzdHNTeW5jIGZcbiAgICAgICAgICAgIG5vb25fbG9hZCA9IHJlcXVpcmUgJ25vb24vanMvbG9hZCdcbiAgICAgICAgICAgIGV4cGFuZCBub29uX2xvYWQgZiBcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZXJyb3IgXCJjYW4ndCBsb2NhdGUgc3ludGF4IGZpbGUgI3tmfVwiXG4gICAgXG4gICAgaWYgYXJncy5wYXR0ZXJuP1xuICAgICAgICBub29uX3BhcnNlID0gcmVxdWlyZSAnbm9vbi9qcy9wYXJzZSdcbiAgICAgICAgcGF0dGVybnMgPSBleHBhbmQgbm9vbl9wYXJzZSBhcmdzLnBhdHRlcm5cbiAgICAgICAgIyBsb2cgcGF0dGVybnNcbiAgICBlbHNlIGlmIGFyZ3MucGF0dGVybkZpbGU/XG4gICAgICAgIHBhdHRlcm5zID0gbG9hZFN5bnRheCBhcmdzLnBhdHRlcm5GaWxlXG4gICAgXG4gICAgaWYgbm90IHBhdHRlcm5zP1xuICAgICAgICByZXR1cm4gKGNodW5rKSAtPiBmdW5reUJncmQgZGltVGV4dCBjaHVua1xuICAgICAgICBcbiAgICBtYXRjaHIgPSByZXF1aXJlICcuL21hdGNocidcbiAgICBtYXRjaHJDb25maWcgPSBtYXRjaHIuY29uZmlnIHBhdHRlcm5zXG4gICAgICAgICAgXG4gICAgcGF0dGVybiA9IChjaHVuaykgLT5cbiAgICAgICAgY2h1bmsgPSBrb2xvci5zdHJpcCBjaHVua1xuICAgICAgICBybmdzID0gbWF0Y2hyLnJhbmdlcyBtYXRjaHJDb25maWcsIGNodW5rXG4gICAgICAgIGRpc3MgPSBtYXRjaHIuZGlzc2VjdCBybmdzXG4gICAgICAgIFxuICAgICAgICBpZiBkaXNzLmxlbmd0aFxuICAgICAgICAgICAgZm9yIGRpIGluIFtkaXNzLmxlbmd0aC0xLi4wXVxuICAgICAgICAgICAgICAgIGQgPSBkaXNzW2RpXVxuICAgICAgICAgICAgICAgIGNscnpkID0gY29sb3JpemUgZC5tYXRjaCwgZC5zdGFjay5yZXZlcnNlKClcbiAgICAgICAgICAgICAgICBjaHVuayA9IGNodW5rLnNsaWNlKDAsIGQuc3RhcnQpICsgY2xyemQgKyBjaHVuay5zbGljZShkLnN0YXJ0K2QubWF0Y2gubGVuZ3RoKVxuICAgICAgICBjaHVua1xuICAgICAgICBcbiAgICByZXR1cm4gcGF0dGVyblxuXG4jICAwMDAwMDAwICAwMDAwMDAwMDAgIDAwMDAwMDAwICAgMDAwMDAwMDAgICAwMDAwMDAwICAgMDAgICAgIDAwXG4jIDAwMCAgICAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG4jIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMDAwMDAgICAgMDAwMDAwMCAgIDAwMDAwMDAwMCAgMDAwMDAwMDAwXG4jICAgICAgMDAwICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwICAgICAgIDAwMCAgIDAwMCAgMDAwIDAgMDAwXG4jIDAwMDAwMDAgICAgICAwMDAgICAgIDAwMCAgIDAwMCAgMDAwMDAwMDAgIDAwMCAgIDAwMCAgMDAwICAgMDAwXG5cbmNvbG9yU3RyZWFtID0gKHN0cmVhbSwgcGF0dGVybikgLT5cblxuICAgIGxpbmVubyA9IDBcbiAgICBidWZmZXIgPSAnJ1xuICAgIHN0cmVhbS5vbiAnZGF0YScgKGNodW5rKSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgbm90IGNodW5rLmVuZHNXaXRoICdcXG4nXG4gICAgICAgICAgICBidWZmZXIgKz0gY2h1bmtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgXG4gICAgICAgIGxpbmVzID0gKGJ1ZmZlcitjaHVuaykuc3BsaXQgJ1xcbidcbiAgICAgICAgY29sb3JMaW5lcyA9IGxpbmVzLm1hcCAobCkgLT4gcGF0dGVybiBsXG4gICAgICAgIFxuICAgICAgICBpZiBhcmdzLnNraXBFbXB0eVxuICAgICAgICAgICAgY29sb3JMaW5lcyA9IGNvbG9yTGluZXMuZmlsdGVyIChsKSAtPiBcbiAgICAgICAgICAgICAgICBrb2xvci5zdHJpcChsKS5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGlmIGFyZ3MubGluZU51bWJlcnNcbiAgICAgICAgICAgIGNvbG9yTGluZXMgPSBjb2xvckxpbmVzLm1hcCAobCkgLT4gXG4gICAgICAgICAgICAgICAgbGluZW5vICs9IDFcbiAgICAgICAgICAgICAgICByZXR1cm4gZ3JheShkaW0gcnBhZChcIiN7bGluZW5vfVwiLDYpKSArIGxcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgbG9nIGNvbG9yTGluZXMuam9pbiAnXFxuJ1xuICAgICAgICBidWZmZXIgPSAnJ1xuICAgICAgICBcbnN5bnRheFN0cmVhbSA9IChzdHJlYW0sIGV4dCkgLT5cblxuICAgIGxpbmVubyA9IDBcbiAgICBidWZmZXIgPSAnJ1xuICAgIHN0cmVhbS5vbiAnZGF0YScgKGNodW5rKSAtPlxuICAgICAgICBcbiAgICAgICAgaWYgbm90IGNodW5rLmVuZHNXaXRoICdcXG4nXG4gICAgICAgICAgICBidWZmZXIgKz0gY2h1bmtcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgbGluZXMgPSAoYnVmZmVyK2NodW5rKS5zcGxpdCAnXFxuJ1xuICAgICAgICBjb2xvckxpbmVzID0gW11cbiAgICAgICAgXG4gICAgICAgIHJuZ3MgPSBrbG9yLmRpc3NlY3QgbGluZXMsIGV4dFxuICAgICAgICBmb3IgaW5kZXggaW4gWzAuLi5saW5lcy5sZW5ndGhdXG4gICAgICAgICAgICBjb2xvckxpbmVzLnB1c2gga2xvci5rb2xvcml6ZUNodW5rcyBjaHVua3M6cm5nc1tpbmRleF0sIG51bWJlcjphcmdzLmxpbmVOdW1iZXJzIGFuZCBpbmRleCsxXG4gICAgICAgIFxuICAgICAgICBpZiBhcmdzLnNraXBFbXB0eVxuICAgICAgICAgICAgY29sb3JMaW5lcyA9IGNvbG9yTGluZXMuZmlsdGVyIChsKSAtPiBcbiAgICAgICAgICAgICAgICBrb2xvci5zdHJpcChsKS5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIGxvZyBjb2xvckxpbmVzLmpvaW4gJ1xcbidcbiAgICAgICAgYnVmZmVyID0gJydcbiAgICBcbiMjI1xuIDAwMDAwMDAgICAwMDAwMDAwICAgMDAwMDAwMDAwICAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgIFxuMDAwICAgICAgIDAwMDAwMDAwMCAgICAgMDAwICAgICAgIFxuMDAwICAgICAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgIFxuIDAwMDAwMDAgIDAwMCAgIDAwMCAgICAgMDAwICAgICAgIFxuIyMjXG4gICAgXG5pZiBhcmdzLmZpbGUubGVuZ3RoXG4gIFxuICAgIHNsYXNoID0gcmVxdWlyZSAna3NsYXNoJ1xuICAgIFxuICAgIGZvciBmaWxlIGluIGFyZ3MuZmlsZSAgICBcblxuICAgICAgICB0ZXh0ID0gc2xhc2gucmVhZFRleHQgZmlsZVxuICBcbiAgICAgICAgbG9nIGtsb3Iuc3ludGF4IHRleHQ6dGV4dCwgZXh0OnNsYXNoLmV4dChmaWxlKSwgbnVtYmVyczphcmdzLmxpbmVOdW1iZXJzXG4gICAgICAgICAgICAgICAgXG5lbHNlXG4gICAgXG4gICAgcHJvY2Vzcy5zdGRpbi5zZXRFbmNvZGluZyAndXRmOCdcbiAgICBcbiAgICBpZiBhcmdzLmV4dCBhbmQgYXJncy5leHQgaW4ga2xvci5leHRzXG4gICAgICAgIHN5bnRheFN0cmVhbSBwcm9jZXNzLnN0ZGluLCBhcmdzLmV4dFxuICAgIGVsc2UgICAgXG4gICAgICAgIGNvbG9yU3RyZWFtIHByb2Nlc3Muc3RkaW4sIHBhdHRlcm5GdW5jKClcblxuIyBwcm9jZXNzLm9uICdleGl0JywgKGNvZGUpIC0+IOKWuGVuZCAnY29sb3JjYXQnXG4iXX0=
//# sourceURL=../coffee/colorcat.coffee