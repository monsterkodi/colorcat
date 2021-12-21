// monsterkodi/kode 0.174.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return (l != null ? typeof l.length === 'number' ? l : [] : [])}}

var args, bgfunc, bgrd, bgrdColors, c, clrlst, cnames, colorize, colorStream, dimText, expand, fatText, fbgcol, fbgnms, file, funkyBgrd, funkyText, i, invert, k, karg, klor, kolor, NEWLINE, noon_stringify, patternFunc, regexes, rpad, s, shortb, shortf, shorts, slash, syntaxStream, text, textColors, v

klor = require('klor')
karg = require('karg')
kolor = klor.kolor
kolor.globalize()
NEWLINE = /\r?\n/

rpad = function (s, l)
{
    s = String(s)
    while (s.length < l)
    {
        s += ' '
    }
    return s
}
text = {white:'w',cyan:'c',magenta:'m',blue:'b',yellow:'y',green:'g',red:'r'}
textColors = ''
for (c in text)
{
    s = text[c]
    shorts = ''
    switch (s)
    {
        case 'x':
        case 'z':
            break
        default:
            for (i = 1; i <= 8; i++)
        {
            shortf = s + i
            shorts += kolor[shortf](' ' + shortf + ' ')
        }
    }

    textColors += `    ${c}  . ? ${kolor[c]('██')}${dim(kolor[c]('██'))}${shorts} . = false . - ${text[c]}\n`
}
bgrd = {bgRed:'R',bgGreen:'G',bgYellow:'Y',bgBlue:'B',bgMagenta:'M',bgCyan:'C',bgWhite:'W'}

bgfunc = function (c)
{
    s = bgrd[c]
    switch (s)
    {
        case 'Z':
            return 'W2'

        case 'W':
            return 'W4'

        default:
            return s + 4
    }

}
bgrdColors = ''
for (c in bgrd)
{
    s = bgrd[c]
    shorts = ''
    switch (s)
    {
        case 'W':
            for (i = 1; i <= 8; i++)
            {
                shortb = 'W' + i
                shortf = 'w'.toLowerCase() + (9 - i)
                shorts += kolor[shortf](kolor[shortb](' ' + shortb + ' '))
            }
            break
        case 'Z':
            break
        default:
            for (i = 1; i <= 8; i++)
        {
            shortb = s + i
            shortf = s.toLowerCase() + (9 - i)
            shorts += kolor[shortf](kolor[shortb](' ' + shortb + ' '))
        }
    }

    bgrdColors += `    ${c}  . ? ${reset(kolor[bgfunc(c)]("    "))}${shorts} . = false . - ${bgrd[c]}\n`
}
args = karg(`colorcat
    file         the file(s) to display or stdin    **
    fat          . ? ${gray('bold                                ')}      . = false  
    dim          . ? ${dim(white('  ▼▼ dim                            '))} . = false
${textColors}
${bgrdColors}
    ext          use syntax highlighting for *.ext        
    pattern      colorize with pattern
    patternFile  colorize with patterns in file     -P
    skipEmpty    skip empty lines                   = false
    lineNumbers  prepend output with line numbers   = false
    debug                                           = false -X
    
version   ${require(`${__dirname}/../package.json`).version}`)
if (args.debug)
{
    noon_stringify = require('noon/js/stringify')
    console.log(noon_stringify(args,{colors:true}))
}

colorize = function (str, stack)
{
    var n, spl

    try
    {
        spl = stack.map(function (s)
        {
            return String(s).split('.')
        })
        spl = spl.flat()
        if (!(_k_.in('keep',spl)))
        {
            var list = _k_.list(spl)
            for (var _120_18_ = 0; _120_18_ < list.length; _120_18_++)
            {
                s = list[_120_18_]
                if (s.substr(0,2) === 's:')
                {
                    str = s.substr(2)
                    spl = spl.filter(function (s)
                    {
                        return s.substr(0,2) !== 's:'
                    })
                    break
                }
            }
        }
        var list1 = _k_.list(spl)
        for (var _126_14_ = 0; _126_14_ < list1.length; _126_14_++)
        {
            n = list1[_126_14_]
            if ((kolor[n] != null))
            {
                str = kolor[n](str)
            }
            else if ((kolor[bgfunc(n)] != null))
            {
                str = kolor[bgfunc(n)](str)
            }
        }
    }
    catch (err)
    {
        console.error(err)
    }
    return str
}
regexes = []
clrlst = Object.assign({},bgrd)
clrlst = Object.assign(clrlst,text)
fbgnms = kolor.FG_NAMES.concat(kolor.BG_NAMES)
fbgcol = kolor.FG_COLORS.concat(kolor.BG_COLORS)
cnames = Object.keys(text).concat(Object.keys(bgrd))
cnames = cnames.concat(fbgnms)
invert = {}
for (k in clrlst)
{
    v = clrlst[k]
    invert[v] = k
}
invert.f = 'bold'
invert.d = 'dim'
invert.k = 'keep'
invert.x = 'gray'
invert.z = 'w2'
invert.Z = 'W1'

expand = function (e)
{
    var cls, expd, pat

    expd = function (c)
    {
        var r, _166_19_

        if (_k_.in(c[0],fbgcol))
        {
            if (_k_.in(c.slice(0, 2),fbgnms))
            {
                if (c.length === 2)
                {
                    return c
                }
                else
                {
                    return c.slice(0, 2) + '.' + expd(c.slice(2))
                }
            }
        }
        if (((c != null ? c.split : undefined) != null) && !(_k_.in(c,cnames)))
        {
            s = c.split('s\:')
            if (invert[s[0][0]])
            {
                if (s[0].length === 1)
                {
                    r = invert[s[0][0]]
                }
                else
                {
                    r = invert[s[0][0]] + '.' + expd(s[0].slice(1))
                }
            }
            else
            {
                r = ''
            }
            if (s.length > 1)
            {
                r += '.s:' + s[1]
            }
            return r
        }
        else
        {
            return c
        }
    }
    for (pat in e)
    {
        cls = e[pat]
        if (cls instanceof Array)
        {
            e[pat] = cls.map(function (clr)
            {
                return expd(clr.split('.')[0])
            })
        }
        else
        {
            e[pat] = expd(cls)
        }
    }
    return e
}

funkyText = function (s)
{
    return s
}

funkyBgrd = function (s)
{
    return s
}
var list = _k_.list(Object.keys(text))
for (var _195_6_ = 0; _195_6_ < list.length; _195_6_++)
{
    c = list[_195_6_]
    if (args[c])
    {
        funkyText = kolor[c]
    }
}
var list1 = _k_.list(Object.keys(bgrd))
for (var _199_6_ = 0; _199_6_ < list1.length; _199_6_++)
{
    c = list1[_199_6_]
    if (args[c])
    {
        funkyBgrd = kolor[bgfunc(c)]
    }
}
if (args.fat)
{
    fatText = function (s)
    {
        return bold(funkyText(s))
    }
}
else
{
    fatText = funkyText
}
if (args.dim)
{
    dimText = function (s)
    {
        return dim(fatText(s))
    }
}
else
{
    dimText = fatText
}

patternFunc = function ()
{
    var loadSyntax, matchr, matchrConfig, noon_parse, pattern, patterns, _229_19_, _233_28_

    loadSyntax = function (f)
    {
        var fs, noon_load

        fs = require('fs')
        if (fs.existsSync(f))
        {
            noon_load = require('noon/js/load')
            return expand(noon_load(f))
        }
        else
        {
            console.error(`can't locate syntax file ${f}`)
        }
    }
    if ((args.pattern != null))
    {
        noon_parse = require('noon/js/parse')
        patterns = expand(noon_parse(args.pattern))
    }
    else if ((args.patternFile != null))
    {
        patterns = loadSyntax(args.patternFile)
    }
    if (!(patterns != null))
    {
        return function (chunk)
        {
            return funkyBgrd(dimText(chunk))
        }
    }
    matchr = require('./matchr')
    matchrConfig = matchr.config(patterns)
    pattern = function (chunk)
    {
        var clrzd, d, di, diss, rngs

        chunk = kolor.strip(chunk)
        rngs = matchr.ranges(matchrConfig,chunk)
        diss = matchr.dissect(rngs)
        if (diss.length)
        {
            for (di = diss.length - 1; di <= 0; di++)
            {
                d = diss[di]
                clrzd = colorize(d.match,d.stack.reverse())
                chunk = chunk.slice(0,d.start) + clrzd + chunk.slice(d.start + d.match.length)
            }
        }
        return chunk
    }
    return pattern
}

colorStream = function (stream, pattern)
{
    var buffer, lineno

    lineno = 0
    buffer = ''
    return stream.on('data',function (chunk)
    {
        var colorLines, lines

        if (!chunk.endsWith('\n'))
        {
            buffer += chunk
            return
        }
        lines = (buffer + chunk).split('\n')
        colorLines = lines.map(function (l)
        {
            return pattern(l)
        })
        if (args.skipEmpty)
        {
            colorLines = colorLines.filter(function (l)
            {
                return kolor.strip(l).length > 0
            })
        }
        if (args.lineNumbers)
        {
            colorLines = colorLines.map(function (l)
            {
                lineno += 1
                return gray(dim(rpad(`${lineno}`,6))) + l
            })
        }
        console.log(colorLines.join('\n'))
        return buffer = ''
    })
}

syntaxStream = function (stream, ext)
{
    var buffer, lineno

    lineno = 0
    buffer = ''
    return stream.on('data',function (chunk)
    {
        var colorLines, index, lines, rngs

        if (!chunk.endsWith('\n'))
        {
            buffer += chunk
            return
        }
        lines = (buffer + chunk).split('\n')
        colorLines = []
        rngs = klor.dissect(lines,ext)
        for (index = 0; index < lines.length; index++)
        {
            colorLines.push(klor.kolorizeChunks({chunks:rngs[index],number:args.lineNumbers && index + 1}))
        }
        if (args.skipEmpty)
        {
            colorLines = colorLines.filter(function (l)
            {
                return kolor.strip(l).length > 0
            })
        }
        console.log(colorLines.join('\n'))
        return buffer = ''
    })
}
if (args.file.length)
{
    slash = require('kslash')
    var list2 = _k_.list(args.file)
    for (var _323_13_ = 0; _323_13_ < list2.length; _323_13_++)
    {
        file = list2[_323_13_]
        text = slash.readText(file)
        console.log(klor.syntax({text:text,ext:slash.ext(file),numbers:args.lineNumbers}))
    }
}
else
{
    process.stdin.setEncoding('utf8')
    if (args.ext && _k_.in(args.ext,klor.exts))
    {
        syntaxStream(process.stdin,args.ext)
    }
    else
    {
        colorStream(process.stdin,patternFunc())
    }
}