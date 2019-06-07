###
 0000000   0000000   000       0000000   00000000    0000000   0000000   000000000
000       000   000  000      000   000  000   000  000       000   000     000   
000       000   000  000      000   000  0000000    000       000000000     000   
000       000   000  000      000   000  000   000  000       000   000     000   
 0000000   0000000   0000000   0000000   000   000   0000000  000   000     000   
###

▸profile 'klor' klor = require 'klor'
▸profile 'karg' karg = require 'karg'

kolor  = klor.kolor
kolor.globalize()

NEWLINE = /\r?\n/

#  0000000   00000000    0000000    0000000
# 000   000  000   000  000        000     
# 000000000  0000000    000  0000  0000000 
# 000   000  000   000  000   000       000
# 000   000  000   000   0000000   0000000 

rpad = (s, l) ->
    s = String s
    while s.length < l then s += ' '
    s

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
for c in Object.keys text
    textColors += "    #{c}  . = false . - #{text[c]} . ? #{kolor[c] bold '██'}#{kolor[c] '██'}#{kolor[c] dim '██'} #{kolor[c](c) }\n"

bgrd = 
    bgBlack:   'Z'
    bgRed:     'R' 
    bgGreen:   'G'
    bgBlue:    'B'
    bgYellow:  'Y'
    bgMagenta: 'M'
    bgCyan:    'C'
    bgWhite:   'W'
    
bgfunc = (c) ->
    s = bgrd[c]
    switch s
        when 'Z' then 'W2'
        when 'W' then 'W4'
        else s+4
    
bgrdColors = ''
for c,s of bgrd
    ci = black "    " + rpad c,11
    bgrdColors += "    #{c}  . = false . - #{bgrd[c]} . ? #{reset(kolor[bgfunc c](ci))}\n"
        
args = karg """

colorcat

    file         . ? the file(s) to display or stdin . **
#{textColors}
    fat          . ? #{bold white '▲▲     fat'}   . = false
    dim                                           . = false
        ?           |#{dim white '    ▲▲ dim'} 
#{bgrdColors}
    ext          . ? use syntax highlighting for *.ext
    pattern      . ? colorize with pattern
    patternFile  . ? colorize with patterns in file   . - P
    skipEmpty    . ? skip empty lines                       . = false
    lineNumbers  . ? prepend output with line numbers       . = false
    debug                                             . - X . = false
    
version   #{require("#{__dirname}/../package.json").version}
"""

if args.debug
    noon = require 'noon'
    log noon.stringify args, colors:true
    
#  0000000   0000000   000       0000000   00000000   000  0000000  00000000
# 000       000   000  000      000   000  000   000  000     000   000     
# 000       000   000  000      000   000  0000000    000    000    0000000 
# 000       000   000  000      000   000  000   000  000   000     000     
#  0000000   0000000   0000000   0000000   000   000  000  0000000  00000000

colorize = (str, stack) ->
    try
        spl = stack.map (s) -> String(s).split '.'
        spl = spl.flat()

        if not ('keep' in spl)
            for s in spl
                if s.substr(0,2) == 's:'
                    str = s.substr(2)
                    spl = spl.filter (s) -> s.substr(0,2) != 's:'
                    break
                
        for n in spl
            if kolor[n]?
                str = kolor[n] str
            else if kolor[bgfunc n]?
                str = kolor[bgfunc n] str
    catch err
        error err
    str

# 00000000  000   000  00000000    0000000   000   000  0000000  
# 000        000 000   000   000  000   000  0000  000  000   000
# 0000000     00000    00000000   000000000  000 0 000  000   000
# 000        000 000   000        000   000  000  0000  000   000
# 00000000  000   000  000        000   000  000   000  0000000  

regexes = []

expand = (e) ->
    clrlst = Object.assign text, bgrd
    cnames = Object.keys(text).concat Object.keys(bgrd)
    invert = {}
    for k,v of clrlst then invert[v] = k
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
        if cls instanceof Array
            e[pat] = cls.map (clr) -> expd clr.split('.')[0]
        else
            e[pat] = expd cls
    e 

# 00000000  000   000  000   000  000   000  000   000
# 000       000   000  0000  000  000  000    000 000 
# 000000    000   000  000 0 000  0000000      00000  
# 000       000   000  000  0000  000  000      000   
# 000        0000000   000   000  000   000     000   

funkyText = (s) -> s
funkyBgrd = (s) -> s

for c in Object.keys text
    if args[c]
        funkyText = kolor[c]
        
for c in Object.keys bgrd
    if args[c]
        funkyBgrd = kolor[bgfunc c]

if args.fat
    fatText = (s) -> funkyText(s).bold
else
    fatText = funkyText

if args.dim
    dimText = (s) -> fatText(s).dim
else
    dimText = fatText

# 00000000    0000000   000000000  000000000  00000000  00000000   000   000   0000000
# 000   000  000   000     000        000     000       000   000  0000  000  000     
# 00000000   000000000     000        000     0000000   0000000    000 0 000  0000000 
# 000        000   000     000        000     000       000   000  000  0000       000
# 000        000   000     000        000     00000000  000   000  000   000  0000000 

patternFunc = ->
    
    ▸profile 'noon'   noon   = require 'noon'
    ▸profile 'matchr' matchr = require './matchr'
    
    loadSyntax = (f) ->
        fs = require 'fs'
        if fs.existsSync f
            expand noon.load f 
        else
            error "can't locate syntax file #{f}"
    
    if args.pattern?
        patterns = expand noon.parse args.pattern
    else if args.patternFile?
        patterns = loadSyntax args.patternFile
    
    if not patterns?
        return (chunk) -> funkyBgrd dimText chunk
        
    matchrConfig = matchr.config patterns
            
    pattern = (chunk) ->
        chunk = kolor.strip chunk
        rngs = matchr.ranges matchrConfig, chunk
        diss = matchr.dissect rngs
        
        if diss.length
            for di in [diss.length-1..0]
                d = diss[di]
                clrzd = colorize d.match, d.stack.reverse()
                chunk = chunk.slice(0, d.start) + clrzd + chunk.slice(d.start+d.match.length)
        chunk
        
    return pattern

#  0000000  000000000  00000000   00000000   0000000   00     00
# 000          000     000   000  000       000   000  000   000
# 0000000      000     0000000    0000000   000000000  000000000
#      000     000     000   000  000       000   000  000 0 000
# 0000000      000     000   000  00000000  000   000  000   000

colorStream = (stream, pattern) ->
    
    lineno = 0
    stream.on 'data', (chunk) ->
        
        lines = chunk.split '\n'
        colorLines = lines.map (l) -> pattern l
        
        if args.skipEmpty
            colorLines = colorLines.filter (l) -> 
                kolor.strip(l).length > 0
                
        if args.lineNumbers
            colorLines = colorLines.map (l) -> 
                lineno += 1
                return gray(dim rpad("#{lineno}",6)) + l
                
        log colorLines.join '\n'
        
syntaxStream = (stream, ext) ->

    lineno = 0
    stream.on 'data', (chunk) ->
        
        lines = chunk.split '\n'
        colorLines = []
        
        rngs = klor.dissect lines, ext
        for index in [0...lines.length]
            colorLines.push output rngs[index], index+1, []
        
        if args.skipEmpty
            colorLines = colorLines.filter (l) -> 
                kolor.strip(l).length > 0
                
        log colorLines.join '\n'
    
# 000   000   0000000   000       0000000   00000000   000  0000000  00000000  
# 000  000   000   000  000      000   000  000   000  000     000   000       
# 0000000    000   000  000      000   000  0000000    000    000    0000000   
# 000  000   000   000  000      000   000  000   000  000   000     000       
# 000   000   0000000   0000000   0000000   000   000  000  0000000  00000000  

LI = /(\sli\d\s|\sh\d\s)/

kolorize = (chunk) -> 
    
    if cn = kolor.map[chunk.value]
        if cn instanceof Array
            v = chunk.match
            for cr in cn
                v = kolor[cr] v
            return v
        else
            return kolor[cn] chunk.match
            
    if chunk.value.endsWith 'file'
        w8 chunk.match
    else if chunk.value.endsWith 'ext'
        w3 chunk.match
    else if chunk.value.startsWith 'punct'
        if LI.test chunk.value
            colorize match:chunk.match, value:chunk.value.replace LI, ' '
        else
            w2 chunk.match
    else
        if LI.test chunk.value
            colorize match:chunk.match, value:chunk.value.replace LI, ' '
        else
            chunk.match

#  0000000   000   000  000000000  00000000   000   000  000000000  
# 000   000  000   000     000     000   000  000   000     000     
# 000   000  000   000     000     00000000   000   000     000     
# 000   000  000   000     000     000        000   000     000     
#  0000000    0000000      000     000         0000000      000     

output = (rngs, number) ->
        
    clrzd = ''
    
    if args.lineNumbers
        numstr = String number
        clrzd += w2(numstr) + rpad '', 4-numstr.length
        
    c = 0

    for i in [0...rngs.length]
        while c < rngs[i].start 
            clrzd += ' '
            c++
        clrzd += kolorize rngs[i]
        c += rngs[i].length
        
    clrzd

###
 0000000   0000000   000000000    
000       000   000     000       
000       000000000     000       
000       000   000     000       
 0000000  000   000     000       
###
    
if args.file.length
  
    ▸profile 'slash' slash = require 'kslash'
    
    for file in args.file    

        text  = slash.readText file
        lines = text.split NEWLINE
        rngs  = klor.dissect lines, slash.ext file
        
        for index in [0...lines.length]
            line = lines[index]
            if line.startsWith '//# sourceMappingURL'
                continue
            log output rngs[index], index+1, []
                
else
    
    process.stdin.setEncoding 'utf8'
    
    if args.ext and args.ext in klor.exts
        syntaxStream process.stdin, args.ext
    else    
        colorStream process.stdin, patternFunc()
