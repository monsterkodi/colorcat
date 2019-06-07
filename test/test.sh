#!/usr/bin/env bash

DIR=`dirname $0`
CC="$DIR/../bin/colorcat"

echo
echo " Examples " | $CC -B

echo "colorize messages: " | $CC -fw
echo "▸ echo ' WARNING! colors ahead!' | colorcat -p \"(.+)(!)(.+) . Rfy . Rfb . Yr\"" | $CC -e sh
echo ' WARNING! colors ahead!' | $CC -p "(.+)(!)(.+) . Rfy . Rfb . Yr" 
echo
echo "highlight words: " | $CC -fw
echo "▸ head -n 6 package.noon | colorcat -p \"color fy :: cat fb8 :: loves fr :: colors g\"" | $CC -e sh
head -n 6 package.noon | $CC -p "color fy :: cat fb8 :: loves fr :: colors g" 
echo
echo "highlight spaces: " | $CC -fw
echo "▸ head -n 4 package.noon | colorcat -p \".* b8B1 :: \s R\"" | $CC -e sh
head -n 4 package.noon | $CC -p ".* b8B1 :: \s R" 
echo
echo "colorize command line tools: " | $CC -fw
echo "▸ npm ls --depth 0" | $CC  -e sh
npm ls --depth 0
echo "▸ npm ls --depth 0 | colorcat -p \"(^\S+)(@)([\d\.]+)\s(.*) . yf . zs:- . m2 . s: :: ([\s┬─├└│]+)(\S+)(@)([\d\.]+)(\s\w+|.*) . xd . g . zs:- . m4 . s:\"" | $CC  -e sh
npm ls --depth 0 | $CC -p "(^\S+)(@)([\d\.]+)\s(.*) . yf . zs:- . m2 . s: :: ([\s┬─├└│]+)(\S+)(@)([\d\.]+)(\s\w+|.*) . xd . g . zs:- . m4 . s:"
echo