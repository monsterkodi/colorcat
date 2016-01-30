#!/usr/bin/env bash
CC="`dirname $0`/../bin/colorcat"
echo
echo " Examples " | $CC -sBfw
echo
echo "colorize script messages: " | $CC -sfw
echo 
echo ' WARNING! colors ahead!' | $CC -sp "(.+)(!)(.+) . Rfy . Rfr . Yr" 
echo
echo "highlight spaces in a file: " | $CC -sfw
echo
head -n 4 package.noon | $CC -sp "\s  R :: .* fx" 
echo
echo "highlight multiple words: " | $CC -sfw
echo
head -n 6 package.noon | $CC -sp " .* fx :: color r :: cat g :: git m :: hub c" 
echo
echo "colorize the output of a command line tool: " | $CC -sfw
echo
npm ls --depth 2 | $CC -sp "([\s┬─├└│]+)(\S+)(@)([\d\.]+) . xd . g . zs:- . m :: (\S+)(@)([\d\.]+)\s(.*) . yf . zs:- . mf . s:"
echo
echo "syntax highlighting:" | $CC -sfw
echo
$CC package.noon