#!/usr/bin/env bash
echo
echo " Examples " | colorcat -aBfw
echo
echo "colorize script messages: " | colorcat -afw
echo 
echo ' WARNING! colors ahead!' | colorcat -ap "(.+)(!)(.+) . Rfy . Rfr . Yr" 
echo
echo "highlight spaces in a file: " | colorcat -afw
echo
head -n 4 package.noon | colorcat -ap "\s  R :: .* fx" 
echo
echo "highlight multiple words: " | colorcat -afw
echo
head -n 6 package.noon | colorcat -ap "color rf :: cat gf :: git mf :: hub cf :: .* fx" 
echo
echo "colorize the output of a command line tool: " | colorcat -afw
echo
npm ls --depth 2 | colorcat -ap "([\s┬─├└│]+)(\S+)(@)([\d\.]+) . xd . g . z . m :: (\S+)(@)([\d\.]+)\s(.*) . yf . z . mf . z"
echo "syntax highlighting:" | colorcat -fw
echo
cat package.noon | colorcat -aP syntax/noon.noon 
