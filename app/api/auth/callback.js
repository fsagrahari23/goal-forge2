import { google } from "googleapis";

export default async function handler(req, res) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Store tokens securely (e.g., in a session or database)
  // For simplicity, we'll send them back here (not recommended for production)
  res.json({ tokens });
}
