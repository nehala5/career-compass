const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const morgan = require('morgan');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '../frontend')));

const dashboardRoutes = require('./routes/dashboard');
const placementsRoutes = require('./routes/placements');
const usersRoutes = require('./routes/users');
const studentsRoutes = require('./routes/students');
const companiesRoutes = require('./routes/companies');
const notificationsRoutes = require('./routes/notifications');

app.use('/api', dashboardRoutes);
app.use('/api', placementsRoutes);
app.use('/api', usersRoutes);
app.use('/api', studentsRoutes);
app.use('/api', companiesRoutes);
app.use('/api', notificationsRoutes);

app.get('/', (req, res) => {
  res.redirect('/users.html');
});

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced successfully');
}).catch(err => {
  console.error('Database sync error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});