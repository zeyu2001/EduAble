import { getUserByUsername, createUser } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await getUserByUsername(username);
    if (user) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const uuid = await createUser(username, password);
    res.status(201).json({ message: 'User created', uuid: uuid });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
