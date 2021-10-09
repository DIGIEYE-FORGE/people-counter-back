const Sequelize = require('sequelize');
const { db } = require('./vars');

const sequelize = new Sequelize(db.dbName, db.username, db.password, {
  host: db.host,
  port: db.port,
  dialect: db.dialect,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
