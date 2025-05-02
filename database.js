require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME, // e.g., 'placement'
    process.env.DB_USER, // e.g., 'root'
    process.env.DB_PASSWORD, // e.g., '1234'
    {
        host: process.env.DB_HOST, // e.g., 'localhost'
        port: process.env.DB_PORT || 3306, // Default MySQL port
        dialect: 'mysql',
        logging: (msg) => {
            if (msg.includes('ERROR')) {
              console.log(msg);  // Log only errors
            }
          },// Enable logging for debugging
    }
);

// Test the connection
sequelize.authenticate()
    .then(() => console.log('Database connection established successfully'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;