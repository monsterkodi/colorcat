// monsterkodi/kode 0.174.0

var _k_

var config, dissect, ranges


config = function (patterns)
{
    var a, p

    return (function () { var result = []; for (var p in patterns)  { var a = patterns[p];result.push([new RegExp(p),a])  } return result }).bind(this)()
}

ranges = function (regexes, str)
{
    var arg, gi, gs, i, j, match, r, reg, rgs, s, value

    rgs = []
    for (r = 0; r < regexes.length; r++)
    {
        reg = regexes[r][0]
        arg = regexes[r][1]
        i = 0
        s = str
        while (s.length)
        {
            match = reg.exec(s)
            if (!(match != null))
            {
                break
            }
            if (match.length === 1)
            {
                rgs.push({start:match.index + i,match:match[0],value:arg,index:r})
                i += match.index + match[0].length
                s = str.slice(i)
            }
            else
            {
                gs = 0
                for (j = 0; j <= match.length - 2; j++)
                {
                    value = arg
                    if ((value instanceof Array) && j < value.length)
                    {
                        value = value[j]
                    }
                    else if ((value instanceof Object) && j < Object.keys(value).length)
                    {
                        value = [Object.keys(value)[j],value[Object.keys(value)[j]]]
                    }
                    gi = match[0].slice(gs).indexOf(match[j + 1])
                    rgs.push({start:match.index + i + gs + gi,match:match[j + 1],value:value,index:r})
                    gs += match[j + 1].length
                }
                i += match.index + match[0].length
                s = str.slice(i)
            }
        }
    }
    return rgs.sort(function (a, b)
    {
        if (a.start === b.start)
        {
            if (a.match.length === b.match.length)
            {
                return a.index - b.index
            }
            else
            {
                return a.match.length - b.match.length
            }
        }
        else
        {
            return a.start - b.start
        }
    })
}

dissect = function (ranges)
{
    var d, di, i, p, pn, rg, ri, si

    if (!ranges.length)
    {
        return []
    }
    di = []
    for (ri = 0; ri < ranges.length; ri++)
    {
        rg = ranges[ri]
        di.push([rg.start,ri])
        di.push([rg.start + rg.match.length])
    }
    di.sort(function (a, b)
    {
        if (a[0] === b[0])
        {
            return a[1] - b[1]
        }
        else
        {
            return a[0] - b[0]
        }
    })
    d = []
    si = -1
    for (i = 0; i < di.length - 1; i++)
    {
        if (di[i][0] > si)
        {
            si = di[i][0]
            d.push({start:si,stack:[]})
        }
    }
    p = 0
    for (ri = 0; ri < ranges.length; ri++)
    {
        rg = ranges[ri]
        while (d[p].start < rg.start)
        {
            p += 1
        }
        pn = p
        while (d[pn].start < rg.start + rg.match.length)
        {
            d[pn].stack.push([rg.index,rg.value])
            if (pn + 1 < d.length)
            {
                if (!d[pn].match)
                {
                    d[pn].match = rg.match.substr(d[pn].start - rg.start,d[pn + 1].start - d[pn].start)
                }
                pn += 1
            }
            else
            {
                if (!d[pn].match)
                {
                    d[pn].match = rg.match.substr(d[pn].start - rg.start)
                }
                break
            }
        }
    }
    d = d.filter(function (i)
    {
        var _143_31_

        return (i.match != null)
    })
    return d = d.map(function (i)
    {
        i.stack = i.stack.sort(function (a, b)
        {
            return a[0] - b[0]
        }).map(function (j)
        {
            return j[1]
        })
        return i
    })
}
module.exports = {config:config,ranges:ranges,dissect:dissect}