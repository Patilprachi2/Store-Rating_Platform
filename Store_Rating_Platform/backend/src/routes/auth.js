const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Store } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_for_dev';

// Register (normal user)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    // validations
    if (!name || name.length < 20 || name.length > 60) return res.status(400).json({ error: 'Name must be 20-60 chars' });
    if (!password || password.length < 8 || password.length > 16) return res.status(400).json({ error: 'Password length 8-16' });
    if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) return res.status(400).json({ error: 'Invalid email' });
    const special = /[!@#$%^&*(),.?":{}|<>]/;
    const upper = /[A-Z]/;
    if (!special.test(password) || !upper.test(password)) return res.status(400).json({ error: 'Password requires uppercase and special char' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hashed, address, role: 'user' });
    return res.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const payload = { id: user.id, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, role: user.role, name: user.name, id: user.id });
});

module.exports = router;
