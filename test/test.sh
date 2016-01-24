#!/usr/bin/env bash
echo
echo " Examples " | colorcat -Bfw
echo
echo "colorize script messages: " | colorcat -fw
echo 
echo ' WARNING! colors ahead!' | colorcat -p "(.+)(!)(.+) . Rfy . Rfr . Yr" 
echo
echo "highlight spaces in a file: " | colorcat -fw
echo
head -n 4 package.noon | colorcat -p "\s  R :: .* fx" 
echo
echo "highlight multiple words: " | colorcat -fw
echo
head -n 6 package.noon | colorcat -p "color rf :: cat gf :: git mf :: hub cf :: .* fx" 
echo
echo "colorize the output of a command line tool: " | colorcat -fw
echo
npm ls --depth 2 | colorcat -p "([\s┬─├└│]+)(\S+)(@)([\d\.]+) . xd . g . z . m :: (\S+)(@)([\d\.]+)\s(.*) . yf . z . mf . z"
echo "syntax highlighting:" | colorcat -fw
echo
cat package.noon | colorcat -P test/noon.noon 
