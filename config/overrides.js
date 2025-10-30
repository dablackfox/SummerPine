const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));
const baseUrl = new URL(config.url).hostname;

module.exports = {
  rules: [
    {
      match: "/report/",
      cssFile: "home.css",
      js: "console.log('Matched any /report/ page');"
    },
        {
      match: "report/rr/_agency/default.htm",
      cssFile: "login.css",
      js: "console.log('Matched any report/rr/_agency/default.htm page');"
    },

    {
      match: `${baseUrl}/saas/login.htm`,
      cssFile: "login.css",
      js: "console.log('Matched /saas/login.htm');"
    },

    {
      match: "^https?://(?!.*?/report/).*\\.cwanz\\.online",
      cssFile: "login.css",
      js: "console.log('Matched cwanz.online domain (excluding /report/)');"
    },


    {
      match: "^file:///",
      cssFile: "global.css",
      js: "console.log('Matched local file (global.css)');"
    },
    {
      match: "^file:///",
      cssFile: "login.css",
      js: "console.log('Matched local file (login.css)');"
    }
  ]
};



