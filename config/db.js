const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

let sequelize;

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  });
} else {
  const dbName = process.env.DB_NAME || 'test_backend_engineer';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || 3306;

  sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false
  });
}

async function initDb() {
  if (process.env.NODE_ENV !== 'test') {
    const dbName = process.env.DB_NAME || 'test_backend_engineer';
    const dbUser = process.env.DB_USER || 'root';
    const dbPassword = process.env.DB_PASSWORD || '';
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || 3306;

    // Connect to MySQL server first without selecting database to make sure it exists
    const connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();
  }

  await sequelize.authenticate();
}

module.exports = {
  sequelize,
  initDb
};
