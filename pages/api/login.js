const jose = require('jose')
import { verifyPassword } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const userId = await verifyPassword(username, password);

    if (userId) {
      const token = await new jose.SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET))
        
      res.status(200).json({
        message: 'Login successful', id: userId, token
      }); 
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
