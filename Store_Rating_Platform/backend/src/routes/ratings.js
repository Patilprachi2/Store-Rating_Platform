const express = require('express');
const router = express.Router();
const { Rating, Store } = require('../models');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

// Submit or update rating by normal user
router.post('/:storeId', authMiddleware, async (req, res) => {
  const user = req.user;
  const { score, comment } = req.body;
  const store = await Store.findByPk(req.params.storeId);
  if (!store) return res.status(404).json({ error: 'Store not found' });
  if (score < 1 || score > 5) return res.status(400).json({ error: 'Score 1-5' });
  let rating = await Rating.findOne({ where: { UserId: user.id, StoreId: store.id } });
  if (!rating) rating = await Rating.create({ score, comment, UserId: user.id, StoreId: store.id });
  else { rating.score = score; rating.comment = comment; await rating.save(); }
  res.json(rating);
});

// Get ratings for a store
router.get('/store/:storeId', async (req, res) => {
  const ratings = await Rating.findAll({ where: { StoreId: req.params.storeId } });
  res.json(ratings);
});

module.exports = router;
