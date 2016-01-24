###
 0000000   0000000   000       0000000   00000000    0000000   0000000   000000000
000       000   000  000      000   000  000   000  000       000   000     000   
000       000   000  000      000   000  0000000    000       000000000     000   
000       000   000  000      000   000  000   000  000       000   000     000   
 0000000   0000000   0000000   0000000   000   000   0000000  000   000     000   
###

fs     = require 'fs'
sds    = require 'sds'
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
    
version   #{require("#{__dirname}/../package.json").version}
"""

###
00000000    0000000   000000000  000000000  00000000  00000000   000   000
000   000  000   000     000        000     000       000   000  0000  000
00000000   000000000     000        000     0000000   0000000    000 0 000
000        000   000     000        000     000       000   000  000  0000
000        000   000     000        000     00000000  000   000  000   000
###

colorize = (names, s) ->
    for n in names.split '.'
        s = colors[n] s
    s

regexes = []

expand = (e) ->
    clrlst = _.assign text, bgrd
    cnames = _.concat _.keys(text), _.keys(bgrd)
    invert = _.invert clrlst
    invert.f = 'bold'
    invert.d = 'dim'

    expd = (c) ->
        if c not in cnames
            c.split('').map((a) -> invert[a]).join '.'
        else
            c
    
    for pat,cls of e
        if _.isArray cls
            e[pat] = cls.map (clr) -> expd clr.split('.')[0]
        else
            e[pat] = expd cls
    e 

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
            for sv in d.stack
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
        process.stdout.write colorLines.join '\n'

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
