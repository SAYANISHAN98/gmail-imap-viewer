const Email = require('../models/Email');
const User = require('../models/User');
const { fetchEmails } = require('../services/imapService');
const { Op } = require('sequelize');

const syncEmails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Get all message_ids already in the DB for this user (for fast dedup)
    const existing = await Email.findAll({
      where: { user_id: userId },
      attributes: ['message_id']
    });
    const knownMessageIds = new Set(existing.map(e => e.message_id));

    // Fetch from IMAP — only new ones returned if everything is already synced
    const { emails, alreadyUpToDate } = await fetchEmails(user.email, user.access_token, knownMessageIds);

    if (alreadyUpToDate) {
      return res.json({ message: 'All emails are already up to date.', newCount: 0 });
    }

    // Save only genuinely new emails
    let newCount = 0;
    for (const email of emails) {
      if (!knownMessageIds.has(email.message_id)) {
        await Email.create({
          user_id: user.id,
          message_id: email.message_id,
          sender: email.sender,
          subject: email.subject,
          date: email.date,
          snippet: email.snippet || ''
        });
        newCount++;
      }
    }
    
    res.json({ message: `Sync complete. ${newCount} new email(s) added.`, newCount });
  } catch (error) {
    next(error);
  }
};

const getEmails = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Support raw offset for "Load More" infinite-scroll style (overrides page calc)
    const offset = req.query.offset !== undefined
      ? parseInt(req.query.offset)
      : (page - 1) * limit;
    const search = req.query.search || '';

    const whereClause = { user_id: req.user.id };
    if (search) {
      whereClause.subject = { [Op.like]: `%${search}%` };
    }

    const { count, rows } = await Email.findAndCountAll({
      where: whereClause,
      order: [['date', 'DESC']],
      limit,
      offset
    });
    
    res.json({
      totalItems: count,
      emails: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    next(error);
  }
};

const searchEmails = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const emails = await Email.findAll({
      where: {
        user_id: req.user.id,
        subject: { [Op.like]: `%${q}%` }
      },
      order: [['date', 'DESC']]
    });
    res.json({ emails });
  } catch (error) {
    next(error);
  }
};

module.exports = { syncEmails, getEmails, searchEmails };
