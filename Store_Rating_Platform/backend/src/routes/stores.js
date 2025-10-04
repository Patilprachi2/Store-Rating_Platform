const express = require('express');
const router = express.Router();
const { Store, Rating, User } = require('../models');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');
const { Op } = require('sequelize');

// Admin: add store
router.post('/', authMiddleware, requireRole(['admin']), async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  const store = await Store.create({ name, email, address, ownerId });
  res.json(store);
});

// List stores with search and sorting, includes overall rating and user's rating if user provided token
router.get('/', async (req, res) => {
  const { q, sortBy='name', order='ASC' } = req.query;
  const where = {};
  if (q) where[Op.or] = [
    { name: { [Op.iLike]: `%${q}%` } },
    { address: { [Op.iLike]: `%${q}%` } },
  ];
  const stores = await Store.findAll({ where, order: [[sortBy, order]] });
  // compute ratings
  const out = [];
  for (const s of stores) {
    const ratings = await Rating.findAll({ where: { StoreId: s.id } });
    const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.score,0)/ratings.length) : null;
    out.push({ id: s.id, name: s.name, email: s.email, address: s.address, averageRating: avg });
  }
  res.json(out);
});

// Admin: view store list with rating
router.get('/admin/list', authMiddleware, requireRole(['admin']), async (req, res) => {
  const stores = await Store.findAll();
  const list = [];
  for (const s of stores) {
    const ratings = await Rating.findAll({ where: { StoreId: s.id } });
    const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.score,0)/ratings.length) : null;
    list.push({ id: s.id, name: s.name, email: s.email, address: s.address, rating: avg });
  }
  res.json(list);
});

// Store owner dashboard: ratings for their store
router.get('/owner/dashboard', authMiddleware, async (req, res) => {
  const user = req.user;
  const store = await Store.findOne({ where: { ownerId: user.id } });
  if (!store) return res.status(404).json({ error: 'No owned store' });
  const ratings = await Rating.findAll({ where: { StoreId: store.id }, include: [User] });
  const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.score,0)/ratings.length) : null;
  res.json({ store: { id: store.id, name: store.name, averageRating: avg }, ratings });
});

module.exports = router;
