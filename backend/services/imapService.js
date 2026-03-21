const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');

const fetchEmails = async (email, accessToken, knownMessageIds = new Set()) => {
  const config = {
    imap: {
      user: email,
      xoauth2: buildXOAuth2Token(email, accessToken),
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      authTimeout: 10000,
      connTimeout: 15000,
      tlsOptions: { rejectUnauthorized: false }
    }
  };

  const connection = await imaps.connect(config);
  try {
    const box = await connection.openBox('INBOX');

    // Step 1: Fetch HEADERS ONLY for the last 100 emails
    const total = box.messages.total;
    const start = Math.max(1, total - 99);
    const searchCriteria = [['UID', `${start}:*`]];

    const headerOnlyOptions = {
      bodies: ['HEADER.FIELDS (FROM SUBJECT DATE MESSAGE-ID)'],
      struct: false,
      markSeen: false
    };

    const headerMessages = await connection.search(searchCriteria, headerOnlyOptions);

    // Step 2: Identify which messages are NEW (not in DB already)
    const newMessages = headerMessages.filter((msg) => {
      const headerPart = msg.parts.find(p => p.which === 'HEADER.FIELDS (FROM SUBJECT DATE MESSAGE-ID)');
      const hdr = headerPart ? headerPart.body : {};
      const msgId = hdr['message-id'] ? hdr['message-id'][0] : msg.attributes.uid.toString();
      return !knownMessageIds.has(msgId);
    });

    if (newMessages.length === 0) {
      connection.end();
      return { emails: [], alreadyUpToDate: true };
    }

    // Step 3: Fetch TEXT body ONLY for new messages
    const uids = newMessages.map(m => m.attributes.uid).join(',');
    const fullFetchOptions = {
      bodies: ['HEADER.FIELDS (FROM SUBJECT DATE MESSAGE-ID)', 'TEXT'],
      struct: false,
      markSeen: false
    };

    const fullMessages = await connection.fetchMessages(uids, fullFetchOptions).catch(() => newMessages);

    const emailData = await Promise.all((fullMessages || newMessages).map(async (msg) => {
      const headerPart = msg.parts.find(p => p.which === 'HEADER.FIELDS (FROM SUBJECT DATE MESSAGE-ID)');
      const textPart = msg.parts.find(p => p.which === 'TEXT');
      const hdr = headerPart ? headerPart.body : {};

      let snippet = '';
      if (textPart && textPart.body) {
        try {
          const parsed = await simpleParser(textPart.body);
          let rawText = parsed.text || '';
          // Fallback: strip HTML tags when plain text is not available
          if (!rawText.trim() && parsed.html) {
            rawText = parsed.html
              .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
              .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/&nbsp;/g, ' ')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"');
          }
          // Remove decorative separator lines (dots, dashes, underscores repeated 3+ times)
          rawText = rawText.replace(/([.\-_=*#])\1{2,}/g, ' ');
          // Collapse bare URLs to a short placeholder
          rawText = rawText.replace(/https?:\/\/\S{60,}/g, '[link]');
          // Normalize whitespace
          snippet = rawText.replace(/\s+/g, ' ').trim().substring(0, 600);
        } catch (e) {
          snippet = '';
        }
      }

      const rawSubject = hdr.subject ? hdr.subject[0] : 'No Subject';
      const rawSender = hdr.from ? hdr.from[0] : 'Unknown';

      return {
        message_id: hdr['message-id'] ? hdr['message-id'][0] : msg.attributes.uid.toString(),
        sender: rawSender.substring(0, 500),
        subject: rawSubject.substring(0, 2000),
        date: hdr.date ? new Date(hdr.date[0]) : new Date(),
        snippet,
      };
    }));

    connection.end();
    return { emails: emailData.reverse(), alreadyUpToDate: false };
  } catch (error) {
    try { connection.end(); } catch (_) {}
    console.error('IMAP fetch error:', error);
    throw error;
  }
};

function buildXOAuth2Token(user, accessToken) {
  return Buffer.from([
    `user=${user}`,
    `auth=Bearer ${accessToken}`,
    '',
    ''
  ].join('\x01'), 'utf-8').toString('base64');
}

module.exports = { fetchEmails };
