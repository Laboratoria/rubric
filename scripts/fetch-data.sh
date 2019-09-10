#! /usr/bin/env bash

npx fetch-gsheets \
  -c ./scripts/credentials.json \
  '1rHFNYizZY5mF7lf64MkeL6cTSElwZo5DhnCRJqQdmIs!General!A1:G' \
  '1rHFNYizZY5mF7lf64MkeL6cTSElwZo5DhnCRJqQdmIs!Front End!A1:H' \
  '1rHFNYizZY5mF7lf64MkeL6cTSElwZo5DhnCRJqQdmIs!UX!A1:H' \
  '1rHFNYizZY5mF7lf64MkeL6cTSElwZo5DhnCRJqQdmIs!Habilidades Blandas!A1:H' \
  '1b4DqU7YuqxolJsXfLJSxPj4ecLBqudzp0FuiMm8YMno!General!A1:G' \
  '1b4DqU7YuqxolJsXfLJSxPj4ecLBqudzp0FuiMm8YMno!Front End!A1:H' \
  '1b4DqU7YuqxolJsXfLJSxPj4ecLBqudzp0FuiMm8YMno!UX!A1:H' \
  '1b4DqU7YuqxolJsXfLJSxPj4ecLBqudzp0FuiMm8YMno!Habilidades Interpessoais!A1:H'
