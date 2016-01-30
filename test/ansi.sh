#!/usr/bin/env bash
CC="`dirname $0`/../bin/colorcat"
echo
echo " Examples " | $CC -saBfw
echo
echo "colorize script messages: " | $CC -safw
echo 
echo ' WARNING! colors ahead!' | $CC -sap "(.+)(!)(.+) . Rfy . Rfr . Yr" 
echo
echo "highlight spaces in a file: " | $CC -safw
echo
head -n 4 package.noon | $CC -sap "\s  R :: .* fx" 
echo
echo "highlight multiple words: " | $CC -safw
echo
head -n 6 package.noon | $CC -sap " .* fx :: color r :: cat g :: git m :: hub c" 
echo
echo "colorize the output of a command line tool: " | $CC -safw
echo
npm ls --depth 2 | $CC -sap "([\s┬─├└│]+)(\S+)(@)([\d\.]+) . xd . g . zs:- . m :: (\S+)(@)([\d\.]+)\s(.*) . yf . zs:- . mf . s:"
echo
echo "syntax highlighting:" | $CC -safw
echo
$CC package.noon
