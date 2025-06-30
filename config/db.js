const mongoose = require('mongoose')

const sequelize = new Sequelize('SmartBizDB', null, null, {
  dialect: 'mssql',
  dialectOptions: {
    instanceName: 'MSSQLLocalDB',
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
  host: 'localhost',
  logging: false,
});

module.exports = sequelize;