import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

const CONTENT_MANAGER_PASSWORD = process.env.CONTENT_MANAGER_PASSWORD || null;

// In-memory token store and attempt tracking
const tokenStore = new Map();
const attempts = new Map(); // ip -> {count, lockUntil}

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 30 * 60 * 1000;
const TOKEN_TTL = 60 * 60 * 1000; // 1 hour

function isLocked(ip) {
  const info = attempts.get(ip);
  if (!info) return false;
  if (info.lockUntil && Date.now() < info.lockUntil) return true;
  return false;
}

app.post('/api/auth/login', (req, res) => {
  if (!CONTENT_MANAGER_PASSWORD) {
    return res.status(503).json({ configured: false, message: 'Content manager not configured' });
  }

  const ip = req.ip;
  if (isLocked(ip)) {
    return res.status(423).json({ message: 'Too many attempts. Locked.' });
  }

  const { password } = req.body || {};
  if (!password) return res.status(400).json({ message: 'Missing password' });

  // constant-time comparison
  const valid = crypto.timingSafeEqual(Buffer.from(String(password)), Buffer.from(String(CONTENT_MANAGER_PASSWORD)));

  if (valid) {
    // reset attempts
    attempts.delete(ip);
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + TOKEN_TTL;
    tokenStore.set(token, { expires });
    res.cookie('cm_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: TOKEN_TTL
    });
    return res.json({ success: true });
  }

  // failed attempt
  const prev = attempts.get(ip) || { count: 0 };
  const count = prev.count + 1;
  if (count >= MAX_ATTEMPTS) {
    attempts.set(ip, { count, lockUntil: Date.now() + LOCKOUT_DURATION });
    return res.status(423).json({ message: 'Too many attempts. Locked.' });
  }
  attempts.set(ip, { count });
  return res.status(401).json({ message: 'Invalid password', remaining: MAX_ATTEMPTS - count });
});

app.post('/api/auth/logout', (req, res) => {
  const token = req.cookies?.cm_token;
  if (token) tokenStore.delete(token);
  res.clearCookie('cm_token');
  res.json({ success: true });
});

app.get('/api/auth/status', (req, res) => {
  if (!CONTENT_MANAGER_PASSWORD) {
    return res.status(503).json({ configured: false, message: 'Content manager not configured' });
  }
  const token = req.cookies?.cm_token;
  if (!token) return res.status(401).json({ authenticated: false });
  const info = tokenStore.get(token);
  if (!info) return res.status(401).json({ authenticated: false });
  if (Date.now() > info.expires) {
    tokenStore.delete(token);
    res.clearCookie('cm_token');
    return res.status(401).json({ authenticated: false });
  }
  return res.json({ authenticated: true });
});

app.listen(PORT, () => {
  console.log(`Auth server listening on port ${PORT}`);
});
