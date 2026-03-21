const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'gmail_viewer',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'mysql',
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;
