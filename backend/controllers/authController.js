const jwt = require('jsonwebtoken');
const { getAuthUrl, getTokens, getUserInfo } = require('../services/oauthService');
const User = require('../models/User');

const login = (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
};

const callback = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).send('Authorization code missing');
    }

    const tokens = await getTokens(code);
    const userInfo = await getUserInfo(tokens);

    let user = await User.findOne({ where: { google_id: userInfo.id } });

    if (!user) {
      user = await User.create({
        email: userInfo.email,
        google_id: userInfo.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      });
    } else {
      await user.update({
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || user.refresh_token,
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1d' }
    );

    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  callback,
};
