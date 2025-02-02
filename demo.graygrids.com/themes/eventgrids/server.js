const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'harsha',    
    password: 'nipuna123',     
    database: 'nipuna25' 
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

app.post('/submit-contact', (req, res) => {
    const { name, subject, email, message } = req.body;

    if (!name || !subject || !email || !message) {
        return res.status(400).send('All fields are required.');
    }

    const sql = 'INSERT INTO ContactUs (name, subject, email, message) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, subject, email, message], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Server error');
        }
        res.status(200).send('Message submitted successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
