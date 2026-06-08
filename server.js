const app = require('./app');
const { initDb, sequelize } = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Initialize database (checks existence, connects, and authenticates)
    await initDb();
    
    // Sync models to database tables
    await sequelize.sync({ force: false });
    console.log('Database tables synchronized successfully.');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
}

startServer();
