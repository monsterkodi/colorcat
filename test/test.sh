#!/usr/bin/env bash
DIR=`dirname $0`
CC="$DIR/../bin/colorcat"
echo
echo " Examples " | $CC -B

echo "colorize messages: " | $CC -sfw
echo 
echo "▸ echo ' WARNING! colors ahead!' | colorcat -sp \"(.+)(!)(.+) . Rfy . Rfb . Yr\"" | $CC -e sh
echo ' WARNING! colors ahead!' | $CC -sp "(.+)(!)(.+) . Rfy . Rfb . Yr" 
echo
echo
echo "highlight words: " | $CC -sfw
echo
echo "▸ head -n 6 package.noon | colorcat -sp \"color fy :: cat fb8 :: loves fr :: colors g\"" | $CC -e sh
head -n 6 package.noon | $CC -sp "color fy :: cat fb8 :: loves fr :: colors g" 
echo
echo
echo "highlight spaces: " | $CC -sfw
echo
echo "▸ head -n 4 package.noon | colorcat -sp \".* b8B1 :: \s R\"" | $CC -e sh
head -n 4 package.noon | $CC -sp ".* b8B1 :: \s R" 
echo
echo
echo "colorize command line tools: " | $CC -sfw
echo
echo "▸ npm ls --depth 0" | $CC  -e sh
npm ls --depth 0
echo "▸ npm ls --depth 0 | colorcat -sp \"([\s┬─├└│]+)(\S+)(@)([\d\.]+) . xd . g . zs:- . m :: (\S+)(@)([\d\.]+)\s(.*) . yf . zs:- . mf . s:\"" | $CC  -e sh
npm ls --depth 0 | $CC -sp "([\s┬─├└│]+)(\S+)(@)([\d\.]+) . xd . g . zs:- . m :: (\S+)(@)([\d\.]+)\s(.*) . yf . zs:- . mf . s:"
echo
echo
# echo "cat with syntax highlighting:" | $CC -sfw
# echo
# echo "▸ colorcat package.json | head -n 7" | $CC -e sh
# $CC package.json | head -n 7