require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cons = require('consolidate');           // Consolidate allows flexibility in choosing templating engines for rendering views.
const dust = require('dustjs-helpers');  //Template engine
const { Pool } = require('pg');
const app = express();

// Connection configuration for PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
 

//assigning the dust as view engine.
app.engine('dust', cons.dust);

//assigning the dust as default engine.
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');


//public folder.
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routes 
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM recipes'); 
        res.render('index', { recipes:result.rows }); // Pass the data to the Dust template
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/add', async (req, res) => {
    try {
        // Use parentheses for VALUES and correct the req.body reference
        const result = await pool.query('INSERT INTO recipes(name, ingredients, directions) VALUES ($1, $2, $3)', [req.body.name, req.body.ingredients, req.body.directions]);  

        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
        // Use parentheses for VALUES and correct the req.body reference
        const result = await pool.query('DELETE FROM recipes WHERE id = $1', [req.params.id]);  

        res.sendStatus(200) ;
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/edit', async (req, res) => {
    try {
        // Use parentheses for VALUES and correct the req.body reference
        const result = await pool.query('UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id=$4', [req.body.name, req.body.ingredients, req.body.directions, req.body.id]);  

        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

//listening 
app.listen(3001 , ()=> {
    console.log('Server Started At Port 3001')
});

