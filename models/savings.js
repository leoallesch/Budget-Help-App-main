const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

const Savings = sequelize.define('savings',  {
    user_id  : {type: Sequelize.INTEGER, allowNull: false},
    type : {type: Sequelize.STRING, allowNull: false},
    total : {type: Sequelize.INTEGER, allowNull: false},
    goal_date : {type: Sequelize.STRING, allowNull: false},
    custom: {type: Sequelize.TINYINT, allowNull: false},
    months : {type: Sequelize.INTEGER, allowNull: false},
    monthly_payment: {type: Sequelize.INTEGER, allowNull: false}
});
Savings.removeAttribute('id');

module.exports = Savings;