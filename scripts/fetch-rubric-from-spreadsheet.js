#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { promisify } = require('util');
const { google } = require('googleapis');


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = path.join(__dirname, 'token.json');


/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
const getNewToken = (oAuth2Client, callback) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        return console.error('Error while trying to retrieve access token', err);
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) {
          return console.error(err);
        }
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
};


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = (credentials, callback) => {
  // eslint-disable-next-line camelcase
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return getNewToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
};


const fetchSheets = (auth) => {
  const sheets = google.sheets({ version: 'v4', auth });
  const ranges = [
    'General!A1:G6',
    'Front End!A1:G26',
    'Habilidades Blandas!A1:G21',
    'UX Common Core!A1:G36',
    // 'UX Track!A1:G20',
  ];

  const get = promisify(
    sheets.spreadsheets.values.get.bind(sheets.spreadsheets.values),
  );

  const fetchRanges = ranges => (
    (!ranges.length)
      ? Promise.resolve([])
      : get({
        spreadsheetId: '1NEOiVKy5IQ2pKHOoTywRG_Hcqlmi47-HkUJs0miJvsI',
        range: ranges[0],
      })
        .then(
          resp => fetchRanges(ranges.slice(1))
            .then(nextResults => [resp.data.values, ...nextResults]),
        )
  );

  fetchRanges(ranges)
    .then(results => console.log(JSON.stringify(results, null, 2)))
    .catch(console.error);
};


// Load client secrets from local file.
fs.readFile(path.join(__dirname, 'credentials.json'), (err, content) => {
  if (err) {
    return console.log('Error loading client secret file:', err);
  }
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), fetchSheets);
});
