const Sequelize = require('sequelize');
const sequelize = require('../config/db.config');

const Income = sequelize.define('income',  {
    user_id  : {type: Sequelize.INTEGER, allowNull: false},
    name : {type: Sequelize.STRING, allowNull: false},
    total : {type: Sequelize.INTEGER, allowNull: false},
    freq : {type: Sequelize.STRING, allowNull: false},
    custom: {type: Sequelize.TINYINT, allowNull: false},
    monthly_total: {type: Sequelize.INTEGER, allowNull: false}
}, {
    freezeTableName: true,
});
Income.removeAttribute('id');

module.exports = Income;