const axios = require('axios');

export default async function handler(req, res) {
  const speechKey = process.env.SPEECH_KEY;
  const speechRegion = process.env.SPEECH_REGION;

  const headers = { 
      headers: {
          'Ocp-Apim-Subscription-Key': speechKey,
          'Content-Type': 'application/x-www-form-urlencoded'
      }
  };

  try {
      const tokenResponse = await axios.post(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, null, headers);
      res.send({ token: tokenResponse.data, region: speechRegion });
  } catch (err) {
      console.error('Error:', err);
      res.status(401).send('There was an error authorizing your speech key.');
  }
}
