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
_      = require 'lodash'

log = console.log

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
    gray:    'z'
    black:   'x'
    white:   'w'
        
textColors = ''
for c in _.keys text
    textColors += "    #{c}  . = false . - #{text[c]} . ? #{colors[c]('██'.bold)}#{colors[c]('██')}#{colors[c].dim('██')} #{colors[c](c) }\n"

bgrd = 
    onBlack:   'Z'
    onRed:     'R' 
    onGreen:   'G'
    onBlue:    'B'
    onYellow:  'Y'
    onMagenta: 'M'
    onCyan:    'C'
    onWhite:   'W'
    
bgrdColors = ''
for c in _.keys bgrd
    bg = 'bg'+c.substr(2)
    ci = ("    "+_.padEnd(c,11)).black
    ci = ("    "+_.padEnd(c,11)).white if c in ['onBlack', 'onBlue']
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

patterns = noon.parse args.pattern if args.pattern?
patterns = sds.load args.patternFile if args.patternFile?

if patterns?
    args.pattern = true if not args.pattern
    for r,c of patterns
        regexes.push
            reg: new RegExp r
            fun: c.map (i) -> (s) -> colorize i, s
        
pattern = (chunk) ->
    log chunk.green.dim
    matches = []
    for r in regexes
        match = r.reg.exec chunk
        if match? and match.length > 1
            match.fun = r.fun
            matches.push match
    if matches
        matches.sort (a,b) -> a.index < b.index
        for match in matches
            s = ''
            for i in [0..match.length-2]
                s += match.fun[i] match[i+1]
            chunk = (chunk.slice 0, match.index) + s + chunk.slice match.index + match[0].length
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
        log colorLines.join colors.reset '\n'

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
