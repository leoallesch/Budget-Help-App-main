const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

const Transactions = sequelize.define('transactions',  {
    trans_id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id  : {type: Sequelize.INTEGER, allowNull: false},
    date : {type: Sequelize.STRING, allowNull: false},
    vendor : {type: Sequelize.STRING, allowNull: false},
    amount : {type: Sequelize.INTEGER, allowNull: false},
    budget: {type: Sequelize.STRING, allowNull: false},
});

module.exports = Transactions;