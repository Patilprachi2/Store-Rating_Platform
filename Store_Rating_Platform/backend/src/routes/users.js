const express = require('express');
const router = express.Router();
const { User, Store, Rating } = require('../models');
const bcrypt = require('bcrypt');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

// Admin: create user (admin or normal or store_owner)
router.post('/', authMiddleware, requireRole(['admin']), async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hashed, address, role });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// List users with filtering & sorting
router.get('/', authMiddleware, requireRole(['admin']), async (req, res) => {
  const { q, role, sortBy='name', order='ASC' } = req.query;
  const where = {};
  if (role) where.role = role;
  if (q) {
    const { Op } = require('sequelize');
    where[Op.or] = [
      { name: { [Op.iLike]: `%${q}%` } },
      { email: { [Op.iLike]: `%${q}%` } },
      { address: { [Op.iLike]: `%${q}%` } },
    ];
  }
  const users = await User.findAll({ where, order: [[sortBy, order]] });
  res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email, address: u.address, role: u.role })));
});

// View user detail
router.get('/:id', authMiddleware, requireRole(['admin']), async (req, res) => {
  const user = await User.findByPk(req.params.id, { include: [{ model: Store, as: 'ownedStore' }, Rating] });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

// Update password (self)
router.post('/me/password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const bcrypt = require('bcrypt');
  const user = req.user;
  const ok = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Old password incorrect' });
  if (!newPassword || newPassword.length < 8) return res.status(400).json({ error: 'New password invalid' });
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ ok: true });
});

module.exports = router;
