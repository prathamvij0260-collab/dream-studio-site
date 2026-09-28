const nodemailer = require('nodemailer');

const clean = (value, max = 1000) => String(value || '').trim().slice(0, max);
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({error: 'Method not allowed'});
  }

  const origin = req.headers.origin;
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.host) {
        return res.status(403).json({error: 'Invalid origin'});
      }
    } catch {
      return res.status(403).json({error: 'Invalid origin'});
    }
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

  // Honeypot: bots often fill hidden fields. Return success without sending.
  if (clean(body.website, 200)) return res.status(200).json({ok: true});

  const name = clean(body.name, 120);
  const business = clean(body.business, 160);
  const email = clean(body.email, 180);
  const phone = clean(body.phone, 80);
  const location = clean(body.location, 160);
  const service = clean(body.service, 160);
  const quantity = clean(body.quantity, 120);
  const timing = clean(body.timing, 120);
  const message = clean(body.message, 5000);

  if (!name || !email || !location || !service || !message || !validEmail(email)) {
    return res.status(400).json({error: 'Please complete all required fields with a valid email address.'});
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailAppPassword) {
    console.error('Missing GMAIL_USER or GMAIL_APP_PASSWORD');
    return res.status(500).json({error: 'Email service is not configured.'});
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {user: gmailUser, pass: gmailAppPassword}
  });

  const subject = `Dream Studio quote request — ${business || name}`;
  const text = [
    'New quote request from dream-studio-site.vercel.app',
    '',
    `Name: ${name}`,
    `Business: ${business || 'Not provided'}`,
    `Email: ${email}`,
    `Phone: ${phone || 'Not provided'}`,
    `Location: ${location}`,
    `Service: ${service}`,
    `Estimated quantity: ${quantity || 'Not provided'}`,
    `Preferred timing: ${timing || 'Not provided'}`,
    '',
    'Project details:',
    message
  ].join('\n');

  try {
    await transporter.sendMail({
      from: `Dream Studio Website <${gmailUser}>`,
      to: 'dreamstudio194@gmail.com',
      replyTo: email,
      subject,
      text
    });
    return res.status(200).json({ok: true});
  } catch (error) {
    console.error('Quote email failed:', error);
    return res.status(500).json({error: 'Unable to send the quote request right now.'});
  }
};
