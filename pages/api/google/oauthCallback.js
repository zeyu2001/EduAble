const { google } = require('googleapis');
const jose = require('jose')
const crypto = require('crypto');

import { getUserByUsername, createUser } from '@/utils/db';

export default async function handler(req, res) {

  const host = req.headers.host;
  if (['localhost:3000', 'notes.eduable.app'].includes(host) === false) {
    res.status(400).json({ error: 'Invalid host' });
    return;
  }
  const protocol = host === 'localhost:3000' ? 'http' : 'https';

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${protocol}://${host}/api/google/oauthCallback`
  );

  if (req.method === 'GET') {
    const { code } = req.query;
    let tokens;
    
    try {
      tokens = (await oauth2Client.getToken(code)).tokens;
    } catch (e) {
      res.redirect(302, '/oauthLogin?error=Login failed');
    }
    
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      version: 'v2',
      auth: oauth2Client
    });

    const { data } = await oauth2.userinfo.get();
    const email = data.email;

    const user = await getUserByUsername(email);
    let userId;

    if (user) {
      userId = user.id; 
    } else {
      userId = await createUser(email, crypto.randomBytes(16).toString('hex'));
    }

    const token = await new jose.SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    res.redirect(302, `/oauthLogin?token=${token}`);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


