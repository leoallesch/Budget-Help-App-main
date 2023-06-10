const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const routes = require('./routes');
const dotenv = require('dotenv');
dotenv.config();

const mysql = require('mysql2/promise');
const sequelize = require('./config/db.config');

initialize();

async function initialize() {
    const connection = await mysql.createConnection({
		host: process.env.HOST,
		user: process.env.USER,
        port: process.env.PORT,
		password: process.env.PASSWORD
	});
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DATABASE}\`;`);
    connection.end();

    const Accounts = require('./models/accounts');
    const Expenses = require('./models/expenses');
    const Income = require('./models/income');
    const Savings = require('./models/savings');
    const Transactions = require('./models/transactions');

    sequelize.sync().then(async () => {
        await Accounts.findOrCreate({where :{
            id:1,
            username: "admin",
            password: "root",
            email: "admin@gmail.com",
            firstname: "Admin",
            lastname: "Admin"
            }})    
        }).then(() => {
            console.log("====================");
            console.log("Database synced.");

            const app = express();
    
            app.use(express.static('public'));
            app.set('views', './views');
            app.set('view engine', 'ejs');
    
            app.use(session({
                secret: 'secret',
                resave: true,
                saveUninitialized: true
            }));
            app.use(bodyParser.urlencoded({extended : true}));
            app.use(bodyParser.json()); 
    
            app.use('/', routes);
    
            app.listen(process.env.APP_PORT, () => {console.log("Server is running on port " + process.env.APP_PORT)});
        });
}