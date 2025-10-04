const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME || 'fs_challenge_dev',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'postgres',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING(400), allowNull: true },
  role: { type: DataTypes.ENUM('admin','user','store_owner'), defaultValue: 'user' },
}, {});

const Store = sequelize.define('Store', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.STRING(400), allowNull: true },
}, {});

const Rating = sequelize.define('Rating', {
  score: { type: DataTypes.INTEGER, allowNull: false, validate: { min:1, max:5 } },
  comment: { type: DataTypes.TEXT, allowNull: true },
}, {});

// Associations
User.hasMany(Rating);
Rating.belongsTo(User);

Store.hasMany(Rating);
Rating.belongsTo(Store);

// If a user is a store owner, link store to owner (optional)
User.hasOne(Store, { as: 'ownedStore', foreignKey: 'ownerId' });
Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

module.exports = { sequelize, User, Store, Rating };
