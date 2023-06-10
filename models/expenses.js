const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

const Expenses = sequelize.define('expenses',  {
    user_id  : {type: Sequelize.INTEGER, allowNull: false},
    type : {type: Sequelize.STRING, allowNull: false},
    total : {type: Sequelize.INTEGER, allowNull: false},
    freq : {type: Sequelize.STRING, allowNull: false},
    custom: {type: Sequelize.TINYINT, allowNull: false},
    monthly_total: {type: Sequelize.INTEGER, allowNull: false}
});
Expenses.removeAttribute('id');

module.exports = Expenses;