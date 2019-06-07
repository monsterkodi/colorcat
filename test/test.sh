#!/usr/bin/env bash
DIR=`dirname $0`
CC="$DIR/../bin/colorcat"
echo
echo " Examples " | $CC -sBfw
echo
echo "colorize script messages: " | $CC -sfw
echo 
echo "▸ echo ' WARNING! colors ahead!' | colorcat -sp \"(.+)(!)(.+) . Rfy . Rfb . Yr\"" | $CC -e sh
echo ' WARNING! colors ahead!' | $CC -sp "(.+)(!)(.+) . Rfy . Rfb . Yr" 
echo
echo
echo "highlight spaces in a file: " | $CC -sfw
echo
echo "▸ head -n 4 package.noon | colorcat -sp \"\s R :: .* fx\"" | $CC -e sh
head -n 4 package.noon | $CC -sp "\s R :: .* fx" 
echo
echo
echo "highlight multiple words: " | $CC -sfw
echo
echo "▸ head -n 6 package.noon | colorcat -sp \".* fx :: color r :: cat g\"" | $CC -e sh
head -n 6 package.noon | $CC -sp ".* fx :: color r :: cat g" 
echo
echo
echo "colorize the output of a command line tool: " | $CC -sfw
echo
echo "▸ npm ls --depth 0 | colorcat -sp \"([\s┬─├└│]+)(\S+)(@)([\d\.]+) . xd . g . zs:- . m :: (\S+)(@)([\d\.]+)\s(.*) . yf . zs:- . mf . s:\"" | $CC  -e sh
npm ls --depth 0 | $CC -sp "([\s┬─├└│]+)(\S+)(@)([\d\.]+) . xd . g . zs:- . m :: (\S+)(@)([\d\.]+)\s(.*) . yf . zs:- . mf . s:"
echo
echo
echo "syntax highlighting:" | $CC -sfw
echo
echo "▸ colorcat package.json | head -n 7" | $CC -e sh
$CC package.json | head -n 7