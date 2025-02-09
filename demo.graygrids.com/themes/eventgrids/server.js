const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require("path");


const app = express();
const port = process.env.PORT || 3000;
;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const htmlPath = __dirname;

app.use(express.static(htmlPath)); 
app.use(express.static(path.join(__dirname, "assets")));

app.get("/", (req, res) => res.sendFile(path.join(htmlPath, "index.html")));
app.get("/about-us", (req, res) => res.sendFile(path.join(htmlPath, "about-us.html")));
app.get("/events", (req, res) => res.sendFile(path.join(htmlPath, "events.html")));
app.get("/team", (req, res) => res.sendFile(path.join(htmlPath, "team.html")));
app.get("/contact", (req, res) => res.sendFile(path.join(htmlPath, "contact.html")));




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

app.post('/register', (req, res) => {
    const { name, email, phone, college, year, course, location } = req.body;

    if (!name || !email || !phone || !college || !year || !course || !location) {
        return res.status(400).send('All fields are required.');
    }

    if (isNaN(phone) || isNaN(year)) {
        return res.status(400).send('Phone and Year should be valid numbers.');
    }

    const sql = `INSERT INTO registrations (name, email, phone, college, year, course, location) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [name, email, phone, college, year, course, location], (err, result) => {
        if (err) {
            console.error('Error inserting student data:', err);
            return res.status(500).send('Server error');
        }
        res.status(200).send('Student registered successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
