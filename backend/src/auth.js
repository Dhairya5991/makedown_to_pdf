import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BASE_URL, ALLOW_DEV_LOGIN } from './config.js';
import { users } from './db.js';
import express from 'express';

if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${BASE_URL}/api/auth/google/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      const id = users.upsertGoogle({
        google_id: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value
      });
      done(null, { id });
    }
  ));
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  const user = users.getById(id);
  if (!user) return done(null, false);
  done(null, user);
});

export const authRouter = express.Router();

authRouter.get('/google', (req, res, next) => {
  if (!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET)) {
    if (ALLOW_DEV_LOGIN) {
      const id = users.upsertGoogle({ google_id: 'dev_' + Date.now(), name: 'Dev User', email: 'dev@example.com', avatar: '' });
      req.login({ id }, err => {
        if (err) return next(err);
        res.redirect('/api/auth/success');
      });
      return;
    }
    res.status(500).json({ error: 'Google OAuth not configured' });
    return;
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

authRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/api/auth/failure' }), (req, res) => {
  res.redirect('/api/auth/success');
});

authRouter.get('/success', (req, res) => {
  res.send('Login successful. You can close this tab.');
});

authRouter.get('/failure', (req, res) => {
  res.status(401).send('Login failed');
});

authRouter.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ ok: true });
  });
});
