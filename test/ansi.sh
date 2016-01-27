#!/usr/bin/env bash
CC="`dirname $0`/../bin/colorcat"
echo
echo " Examples " | $CC -aBfw
echo
echo "colorize script messages: " | $CC -afw
echo 
echo ' WARNING! colors ahead!' | $CC -ap "(.+)(!)(.+) . Rfy . Rfr . Yr" 
echo
echo "highlight spaces in a file: " | $CC -afw
echo
head -n 4 package.noon | $CC -ap "\s  R :: .* fx" 
echo
echo "highlight multiple words: " | $CC -afw
echo
head -n 6 package.noon | $CC -ap " .* fx :: color r :: cat g :: git m :: hub c" 
echo
echo "colorize the output of a command line tool: " | $CC -afw
echo
npm ls --depth 2 | $CC -a -p "([\s┬─├└│]+)(\S+)(@)([\d\.]+) . xd . g . zs:- . m :: (\S+)(@)([\d\.]+)\s(.*) . yf . zs:- . mf . z"
echo "syntax highlighting:" | $CC -afw
echo
cat package.noon | $CC -a -P syntax/noon.noon 
