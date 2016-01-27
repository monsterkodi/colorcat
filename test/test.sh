#!/usr/bin/env bash
CC="`dirname $0`/../bin/colorcat"
echo
echo " Examples " | $CC -Bfw
echo
echo "colorize script messages: " | $CC -fw
echo 
echo ' WARNING! colors ahead!' | $CC -p "(.+)(!)(.+) . Rfy . Rfr . Yr" 
echo
echo "highlight spaces in a file: " | $CC -fw
echo
head -n 4 package.noon | $CC -p "\s  R :: .* fx" 
echo
echo "highlight multiple words: " | $CC -fw
echo
head -n 6 package.noon | $CC -p " .* fx :: color r :: cat g :: git m :: hub c" 
echo
echo "colorize the output of a command line tool: " | $CC -fw
echo
npm ls --depth 2 | $CC -p "([\s┬─├└│]+)(\S+)(@)([\d\.]+) . xd . g . zs:- . m :: (\S+)(@)([\d\.]+)\s(.*) . yf . zs:- . mf . z"
echo "syntax highlighting:" | $CC -fw
echo
cat package.noon | $CC - -P syntax/noon.noon 