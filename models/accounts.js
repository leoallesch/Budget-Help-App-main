const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

const Accounts = sequelize.define('accounts',  {
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    username : {type: Sequelize.STRING, allowNull: false, unique: true},
    password : {type: Sequelize.STRING, allowNull: false},
    email : {type: Sequelize.STRING, allowNull: false},
    firstname: {type: Sequelize.STRING, allowNull: false},
    lastname: {type: Sequelize.STRING, allowNull: false}
});

module.exports = Accounts;