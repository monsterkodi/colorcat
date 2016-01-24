#!/usr/bin/env fish
npm ls --depth 0
npm ls --depth 0 | colorcat -p "(.──\s)(\S+)(@)([\d\.]+) . xd . g . z . m :: (\S+)(@)([\d\.]+)\s(.*) . yf . z . mf . z"
npm ls
npm ls | colorcat -p "([\s┬─├└│]+)(\S+)(@)([\d\.]+) . xd . g . z . m :: (\S+)(@)([\d\.]+)\s(.*) . yf . z . mf . z"
