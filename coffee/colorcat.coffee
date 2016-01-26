###
 0000000   0000000   000       0000000   00000000    0000000   0000000   000000000
000       000   000  000      000   000  000   000  000       000   000     000   
000       000   000  000      000   000  0000000    000       000000000     000   
000       000   000  000      000   000  000   000  000       000   000     000   
 0000000   0000000   0000000   0000000   000   000   0000000  000   000     000   
###

fs     = require 'fs'
sds    = require 'sds'
path   = require 'path'
colors = require 'colors'
noon   = require 'noon'
matchr = require './matchr'
_      = require 'lodash'
log    = console.log

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

    file         . ? the file to display or stdin . *
#{textColors}
    fat          . ? #{'▲▲     fat'.bold.white}   . = false
    dim                                           . = false
        ?           |#{'    ▲▲ dim'.dim.white} 
#{bgrdColors}
    pattern      . ? colorize with pattern
    patternFile  . ? colorize with patterns in file . - P
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

ansi = null
amap = null
if args.ansi256
    ansi = require './colors'
    amap = 
        red:     [ansi.r2, ansi.r4, ansi.r7]
        green:   [ansi.g2, ansi.g4, ansi.g7]
        blue:    [ansi.b2, ansi.b6, ansi.b7]
        yellow:  [ansi.y2, ansi.y5, ansi.y6]
        magenta: [ansi.m1, ansi.m2, ansi.m4]
        cyan:    [ansi.c1, ansi.c2, ansi.c4]
        black:   [ansi.w1, ansi.w1, ansi.w2]
        gray:    [ansi.w2, ansi.w4, ansi.w6]
        white:   [ansi.w6, ansi.w7, ansi.w8]

###
 0000000   0000000   000       0000000   00000000   000  0000000  00000000
000       000   000  000      000   000  000   000  000     000   000     
000       000   000  000      000   000  0000000    000    000    0000000 
000       000   000  000      000   000  000   000  000   000     000     
 0000000   0000000   0000000   0000000   000   000  000  0000000  00000000
###

colorize = (names, str) ->
    
    spl = names.split '.'
    if _.last(spl).substr(0,2) == "s:"
        str = spl.pop().substr(2)
        
    if args.ansi256
        i = 1
        i = 0 if 'dim' in spl
        i = 2 if 'bold' in spl
        rev = _.reverse(spl)
        for n in rev
            if amap[n]?
                str = amap[n][i] + str
        str = ansi.bold + str if 'bold' in spl
        str += ansi.reset
    else
        for n in spl
            if colors[n]?
                str = colors[n] str
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

    expd = (c) ->
        if c not in cnames
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
00000000    0000000   000000000  000000000  00000000  00000000   000   000   0000000
000   000  000   000     000        000     000       000   000  0000  000  000     
00000000   000000000     000        000     0000000   0000000    000 0 000  0000000 
000        000   000     000        000     000       000   000  000  0000       000
000        000   000     000        000     00000000  000   000  000   000  0000000 
###

if args.file?
    syntaxFile = path.join __dirname, '..', 'syntax', path.extname(args.file).substr(1) + '.noon'
    patterns = expand sds.load syntaxFile if fs.existsSync syntaxFile
patterns = expand noon.parse args.pattern if args.pattern?
patterns = expand sds.load args.patternFile if args.patternFile?

matchrConfig = null

if patterns?
    args.pattern = true if not args.pattern
    config = _.mapValues patterns, (v) -> 
        if _.isArray v
            v.map (i) -> (s) -> colorize i, s
        else
            (s) -> colorize v, s
            
    matchrConfig = matchr.config config
        
pattern = (chunk) ->
    
    rngs = matchr.ranges matchrConfig, chunk
    diss = matchr.dissect rngs
    
    if diss.length
        for di in [diss.length-1..0]
            d = diss[di]
            clrzd = d.match    
            for sv in d.stack.reverse()
                clrzd = sv(clrzd)
            chunk = chunk.slice(0, d.start) + clrzd + chunk.slice(d.start+d.match.length)
    chunk

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
 0000000  000000000  00000000   00000000   0000000   00     00
000          000     000   000  000       000   000  000   000
0000000      000     0000000    0000000   000000000  000000000
     000     000     000   000  000       000   000  000 0 000
0000000      000     000   000  00000000  000   000  000   000
###

colorStream = (stream) ->
    stream.on 'data', (chunk) ->
        lines = chunk.split '\n'
        if args.pattern
            colorLines = lines.map (l) -> pattern l
        else
            colorLines = lines.map (l) -> funkyBgrd dimText l
        # process.stdout.write colorLines.join '\n'
        log colorLines.join '\n'

###
 0000000   0000000   000000000      000  00000000  000  000      00000000
000       000   000     000        000   000       000  000      000     
000       000000000     000       000    000000    000  000      0000000 
000       000   000     000      000     000       000  000      000     
 0000000  000   000     000     000      000       000  0000000  00000000
###

if args.file
    stream = fs.createReadStream args.file, encoding: 'utf8'
    colorStream stream
else
    process.stdin.setEncoding 'utf8'
    colorStream process.stdin
