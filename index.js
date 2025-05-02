const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, DataTypes);
db.Placement = require('./Placement')(sequelize, DataTypes);
db.Student = require('./Student')(sequelize, DataTypes);
db.Notification = require('./Notification')(sequelize, DataTypes);
db.Company = require('./Company')(sequelize, DataTypes);

db.User.hasMany(db.Placement, { foreignKey: 'user_id' });
db.Placement.belongsTo(db.User, { foreignKey: 'user_id' });
db.User.hasMany(db.Notification, { foreignKey: 'receiver_id' });
db.Notification.belongsTo(db.User, { foreignKey: 'receiver_id' });
// Uncomment the following after adding company_id migration:
// db.Company.hasMany(db.Notification, { foreignKey: 'company_id' });
// db.Notification.belongsTo(db.Company, { foreignKey: 'company_id' });

module.exports = db;