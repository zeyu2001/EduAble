const { google } = require('googleapis');

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
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    const authorizationUrl = oauth2Client.generateAuthUrl({
      scope: scopes,
      include_granted_scopes: true
    });

    res.status(200).json({ url: authorizationUrl });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
