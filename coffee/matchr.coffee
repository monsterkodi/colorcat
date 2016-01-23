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

regexes = []
for p,a of patterns
    regexes.push
        reg: new RegExp p
        arg: a

matchr = (regexes, str) ->
    ranges = []
    for r in [0...regexes.length]
        reg = regexes[r].reg
        arg = regexes[r].arg
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
                log match.length, match
                for j in [0..match.length-2]
                    value = arg
                    if _.isArray(value) and j < value.length then value = value[j]
                    else if _.isObject(value) and j < _.size(value) then value = [_.keys(value)[j], value[_.keys(value)[j]]]
                    ranges.push
                        start: match.index + i + match[0].indexOf match[j+1]
                        match: match[j+1]
                        value: value
                        index: r
                i += match.index + match[0].length
                s = str.slice i
    ranges.sort (a,b) -> a.start - b.start
    log noon.stringify ranges, colors:true 
    
matchr regexes, "abc1234twowords-2342onewordxxx1yy2zzzz3x4y5z6"    
#                0123456789 123456789 123456789 123456789 1234
#                         10        20        30        40
