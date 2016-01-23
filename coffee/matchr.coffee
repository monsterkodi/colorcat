###
00     00   0000000   000000000   0000000  000   000  00000000 
000   000  000   000     000     000       000   000  000   000
000000000  000000000     000     000       000000000  0000000  
000 0 000  000   000     000     000       000   000  000   000
000   000  000   000     000      0000000  000   000  000   000
###

noon = require 'noon'
_    = require 'lodash'
log  = console.log

patterns = noon.parse """
a       specific char
word    specific word
123     specific number

\\w+    any word
\\d+    any number

(a)(b)          double char
(two)(words)    . first . second
(23)(42)        . 1st 0 . 2nd 1

(x+)[^y]*(y+)[^z]*(z+)   . 1111 . 2222 . 3333
(y+)[^z]*(z+)   .1111-2222-3333
"""

###
 0000000   0000000   000   000  00000000  000   0000000 
000       000   000  0000  000  000       000  000      
000       000   000  000 0 000  000000    000  000  0000
000       000   000  000  0000  000       000  000   000
 0000000   0000000   000   000  000       000   0000000 

convert the patterns object to a list of [RegExp(key), value] pairs
###

config = (patterns) -> ( [new RegExp(p), a] for p,a of patterns )

###
00000000    0000000   000   000   0000000   00000000   0000000
000   000  000   000  0000  000  000        000       000     
0000000    000000000  000 0 000  000  0000  0000000   0000000 
000   000  000   000  000  0000  000   000  000            000
000   000  000   000  000   000   0000000   00000000  0000000 

accepts a list of [regexp, value(s)] pairs and a string
returns a list of objects with information about the matches:

    match: the matched substring
    value: the value for the match
    start: position of match in str
    index: the index of the regexp 
    
    the objects are sorted by start, match.length and index
    
    if the regexp has capture groups then 
        the value for the match of the nth group is
            the nth item of values(s) if value(s) is an array
            the nth [key, value] pair if value(s) is an object
###

ranges = (regexes, str) ->
    
    ranges = []
    for r in [0...regexes.length]
        reg = regexes[r][0]
        arg = regexes[r][1]
        i = 0
        s = str
        while s.length
            match = reg.exec s
            break if not match?
            if match.length == 1
                ranges.push
                    start: match.index + i
                    match: match[0]
                    value: arg
                    index: r
                i += match.index + match[0].length
                s = str.slice i
            else
                for j in [0..match.length-2]
                    value = arg
                    if _.isArray(value) and j < value.length then value = value[j]
                    else if _.isObject(value) and j < _.size(value) 
                        value = [_.keys(value)[j], value[_.keys(value)[j]]]
                    ranges.push
                        start: match.index + i + match[0].indexOf match[j+1]
                        match: match[j+1]
                        value: value
                        index: r
                i += match.index + match[0].length
                s = str.slice i
                
    ranges.sort (a,b) -> 
        if a.start == b.start
            if a.match.length == b.match.length
                a.index - b.index
            else
                a.match.length - b.match.length
        else
            a.start - b.start

###
0000000    000   0000000   0000000  00000000   0000000  000000000
000   000  000  000       000       000       000          000   
000   000  000  0000000   0000000   0000000   000          000   
000   000  000       000       000  000       000          000   
0000000    000  0000000   0000000   00000000   0000000     000   
###

dissect = (ranges) -> 
    p = 0
    for range in ranges
        log range
        
    
flatten = (ranges) ->
    for r in ranges
        log r.match
    
regs = config patterns
rngs = ranges regs, "  _abc1234twowords-2342onewordxxx1yy2zzzz3x4y5z6"    
#                    0123456789 123456789 123456789 123456789 1234567
#                             10        20        30        40

log noon.stringify rngs, colors:true 

dissect rngs

module.exports = 
    config:  config
    ranges:  ranges
    dissect: dissect
    flatten: flatten
