#! /usr/bin/env bash

npx fetch-gsheets \
  -c ./scripts/credentials.json \
  '1Tviny8HzskBKP0HDKXoSClqyHsvQTO0XsWnyKWZGvJA!General!A1:H5' \
  '1Tviny8HzskBKP0HDKXoSClqyHsvQTO0XsWnyKWZGvJA!Front End!A1:J24' \
  '1Tviny8HzskBKP0HDKXoSClqyHsvQTO0XsWnyKWZGvJA!UX Common Core!A1:J4' \
  '1Tviny8HzskBKP0HDKXoSClqyHsvQTO0XsWnyKWZGvJA!Habilidades Blandas!A1:J21'
