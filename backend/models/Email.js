const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Email = sequelize.define('Email', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  message_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sender: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  subject: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  snippet: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'emails',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

Email.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Email, { foreignKey: 'user_id' });

module.exports = Email;
