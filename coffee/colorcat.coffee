###
 0000000   0000000   000       0000000   00000000    0000000   0000000   000000000
000       000   000  000      000   000  000   000  000       000   000     000   
000       000   000  000      000   000  0000000    000       000000000     000   
000       000   000  000      000   000  000   000  000       000   000     000   
 0000000   0000000   0000000   0000000   000   000   0000000  000   000     000   
###

fs     = require 'fs'
path   = require 'path'
colors = require 'colors'
noon   = require 'noon'
matchr = require './matchr'
_      = require 'lodash'

log    = console.log
error  = (err) -> process.stderr.write "[ERROR] ".yellow + "#{err}\n".red

###
 0000000   00000000    0000000    0000000
000   000  000   000  000        000     
000000000  0000000    000  0000  0000000 
000   000  000   000  000   000       000
000   000  000   000   0000000   0000000 
###

text = 
    red:     'r' 
    green:   'g'
    blue:    'b'
    yellow:  'y'
    magenta: 'm'
    cyan:    'c'
    gray:    'x'
    black:   'z'
    white:   'w'
        
textColors = ''
for c in _.keys text
    textColors += "    #{c}  . = false . - #{text[c]} . ? #{colors[c].bold '██'}#{colors[c] '██'}#{colors[c].dim '██'} #{colors[c](c) }\n"

bgrd = 
    bgBlack:   'Z'
    bgRed:     'R' 
    bgGreen:   'G'
    bgBlue:    'B'
    bgYellow:  'Y'
    bgMagenta: 'M'
    bgCyan:    'C'
    bgWhite:   'W'
    
bgrdColors = ''
for c in _.keys bgrd
    bg = 'bg'+c.substr(2)
    ci = colors.black "    "+_.padEnd c,11
    ci = colors.white "    "+_.padEnd c,11 if c in ['bgBlack', 'bgBlue']
    bgrdColors += "    #{c}  . = false . - #{bgrd[c]} . ? #{colors.reset(colors[bg](ci))}\n"
        
args = require('karg') """

colorcat

    file         . ? the file(s) to display or stdin . **
#{textColors}
    fat          . ? #{'▲▲     fat'.bold.white}   . = false
    dim                                           . = false
        ?           |#{'    ▲▲ dim'.dim.white} 
#{bgrdColors}
    ext          . ? use syntax highlighting for *.ext
    pattern      . ? colorize with pattern
    patternFile  . ? colorize with patterns in file . - P
    skipEmpty    . ? skip empty lines             . = false
    lineNumbers  . ? prepend output with line numbers . = false
    ansi256      . ? use 256 colors ansi codes    . = false
    
ansi256              
            ∘ use #{'ansi-256-colors'.gray.bold} instead of #{'colors'.gray.bold} module
            ∘ colors don't get stripped when piping
    
version   #{require("#{__dirname}/../package.json").version}
"""

###
 0000000   000   000   0000000  000
000   000  0000  000  000       000
000000000  000 0 000  0000000   000
000   000  000  0000       000  000
000   000  000   000  0000000   000
###

ansi = require './colors'
amap = null
if args.ansi256
    amap = 
        red:       [ansi.r2, ansi.r4, ansi.r5]
        green:     [ansi.g2, ansi.g4, ansi.g5]
        blue:      [ansi.b2, ansi.b6, ansi.b7]
        yellow:    [ansi.y2, ansi.y5, ansi.y6]
        magenta:   [ansi.m1, ansi.m2, ansi.m4]
        cyan:      [ansi.c1, ansi.c2, ansi.c4]
        black:     [ansi.w1, ansi.w1, ansi.w2]
        gray:      [ansi.w2, ansi.w4, ansi.w5]
        white:     [ansi.w6, ansi.w7, ansi.w8]
        bgRed:     [ansi.R4, ansi.R4, ansi.R4]
        bgGreen:   [ansi.G4, ansi.G4, ansi.G4]
        bgBlue:    [ansi.B6, ansi.B6, ansi.B6]
        bgYellow:  [ansi.Y5, ansi.Y5, ansi.Y5]
        bgMagenta: [ansi.M2, ansi.M2, ansi.M2]
        bgCyan:    [ansi.C2, ansi.C2, ansi.C2]
        bgBlack:   [ansi.W1, ansi.W1, ansi.W1]
        bgGray:    [ansi.W4, ansi.W4, ansi.W4]
        bgWhite:   [ansi.W7, ansi.W7, ansi.W7]

###
 0000000   0000000   000       0000000   00000000   000  0000000  00000000
000       000   000  000      000   000  000   000  000     000   000     
000       000   000  000      000   000  0000000    000    000    0000000 
000       000   000  000      000   000  000   000  000   000     000     
 0000000   0000000   0000000   0000000   000   000  000  0000000  00000000
###

colorize = (str, stack) ->
    try
        spl = stack.map (s) -> 
            String(s).split '.'
        spl = _.flatten spl

        if not ('keep' in spl)
            for s in spl
                if s.substr(0,2) == 's:'
                    str = s.substr(2)
                    spl = spl.filter (s) -> s.substr(0,2) != 's:'
                    break
                
        if args.ansi256
        
            i = 1
            i = 2 if 'bold' in spl
            i = 0 if 'dim'  in spl
            for n in spl
                if amap[n]?
                    str = amap[n][i] + str
            str  = ansi.bold + str if 'bold' in spl
            str += ansi.reset
            
        else
            
            for n in spl
                if colors[n]?
                    str = colors[n] str
    catch err
        error err
    str

###
00000000  000   000  00000000    0000000   000   000  0000000  
000        000 000   000   000  000   000  0000  000  000   000
0000000     00000    00000000   000000000  000 0 000  000   000
000        000 000   000        000   000  000  0000  000   000
00000000  000   000  000        000   000  000   000  0000000  
###

regexes = []

expand = (e) ->
    clrlst = _.assign text, bgrd
    cnames = _.concat _.keys(text), _.keys(bgrd)
    invert = _.invert clrlst
    invert.f = 'bold'
    invert.d = 'dim'
    invert.k = 'keep'

    expd = (c) ->
        if c?.split? and c not in cnames
            s = c.split('s\:')
            r = s[0].split('').map((a) -> invert[a]).join('.')
            r += '.s:' + s[1] if s.length > 1
            r
        else
            c
    
    for pat,cls of e
        if _.isArray cls
            e[pat] = cls.map (clr) -> expd clr.split('.')[0]
        else
            e[pat] = expd cls
    e 

###
00000000  000   000  000   000  000   000  000   000
000       000   000  0000  000  000  000    000 000 
000000    000   000  000 0 000  0000000      00000  
000       000   000  000  0000  000  000      000   
000        0000000   000   000  000   000     000   
###

funkyText = (s) -> s
funkyBgrd = (s) -> s

for c in _.keys text
    if args[c]
        funkyText = colors[c]
for c in _.keys bgrd
    if args[c]
        funkyBgrd = colors['bg'+c.substr(2)]

if args.fat
    fatText = (s) -> funkyText(s).bold
else
    fatText = funkyText

if args.dim
    dimText = (s) -> fatText(s).dim
else
    dimText = fatText

###
00000000    0000000   000000000  000000000  00000000  00000000   000   000   0000000
000   000  000   000     000        000     000       000   000  0000  000  000     
00000000   000000000     000        000     0000000   0000000    000 0 000  0000000 
000        000   000     000        000     000       000   000  000  0000       000
000        000   000     000        000     00000000  000   000  000   000  0000000 
###

patternFunc = (file) ->
    
    loadSyntax = (f) -> expand noon.load f if fs.existsSync f
    
    if args.pattern?
        patterns = expand noon.parse args.pattern
    else if args.patternFile?
        patterns = loadSyntax args.patternFile
    else if args.ext?
        patterns = loadSyntax path.join __dirname, '..', 'syntax', args.ext + '.noon'
    else if file?
        patterns = loadSyntax path.join __dirname, '..', 'syntax', path.extname(file).substr(1) + '.noon'
    
    if not patterns?
        return (chunk) -> funkyBgrd dimText chunk
        
    matchrConfig = matchr.config patterns
            
    pattern = (chunk) ->
        chunk = ansi.strip chunk
        rngs = matchr.ranges matchrConfig, chunk
        diss = matchr.dissect rngs
        
        if diss.length
            for di in [diss.length-1..0]
                d = diss[di]
                clrzd = colorize d.match, d.stack.reverse()
                chunk = chunk.slice(0, d.start) + clrzd + chunk.slice(d.start+d.match.length)
        chunk
        
    return pattern

###
 0000000  000000000  00000000   00000000   0000000   00     00
000          000     000   000  000       000   000  000   000
0000000      000     0000000    0000000   000000000  000000000
     000     000     000   000  000       000   000  000 0 000
0000000      000     000   000  00000000  000   000  000   000
###

colorStream = (stream, pattern) ->
    lineno = 0
    stream.on 'data', (chunk) ->
        lines = chunk.split '\n'
        colorLines = lines.map (l) -> pattern l
        if args.skipEmpty
            colorLines = colorLines.filter (l) -> 
                if args.ansi256
                    ansi.strip(l).length > 0
                else
                    colors.strip(l).length > 0
        if args.lineNumbers
            colorLines = colorLines.map (l) -> 
                lineno += 1
                return _.padEnd("#{lineno}",6).gray.dim + l
        log colorLines.join '\n'

###
 0000000   0000000   000000000      000  00000000  000  000      00000000
000       000   000     000        000   000       000  000      000     
000       000000000     000       000    000000    000  000      0000000 
000       000   000     000      000     000       000  000      000     
 0000000  000   000     000     000      000       000  0000000  00000000
###

if args.file.length
    
    for file in args.file
        stream = fs.createReadStream file, encoding: 'utf8'
        stream.on 'error', (err) -> error " can't read file '#{file}': " + String(err).magenta
        colorStream stream, patternFunc file
            
else
    
    process.stdin.setEncoding 'utf8'
    colorStream process.stdin, patternFunc()
