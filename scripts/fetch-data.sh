#! /usr/bin/env bash

npx fetch-gsheets \
  -c ./scripts/credentials.json \
  '1Tviny8HzskBKP0HDKXoSClqyHsvQTO0XsWnyKWZGvJA!General!A1:H5' \
  '1Tviny8HzskBKP0HDKXoSClqyHsvQTO0XsWnyKWZGvJA!Front End!A1:J24' \
  '1Tviny8HzskBKP0HDKXoSClqyHsvQTO0XsWnyKWZGvJA!UX!A1:J20' \
  '1Tviny8HzskBKP0HDKXoSClqyHsvQTO0XsWnyKWZGvJA!Habilidades Blandas!A1:J21'
