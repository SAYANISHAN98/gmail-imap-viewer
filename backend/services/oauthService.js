const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

const getAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://mail.google.com/',
    ],
  });
};

const getTokens = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

const getUserInfo = async (tokens) => {
  oauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  });
  const res = await oauth2.userinfo.get();
  return res.data;
};

module.exports = {
  getAuthUrl,
  getTokens,
  getUserInfo,
};
