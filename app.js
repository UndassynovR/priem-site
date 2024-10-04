const https = require('https');
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const basicAuth = require('express-basic-auth');
const XLSX = require('xlsx');

// Create Express app
const app = express();
const PORT = process.env.PORT || 443; // Use port 443

// Path to SSL certificates inside the container
const sslOptions = {
  key: fs.readFileSync('/etc/ssl/private/server.key'),
  cert: fs.readFileSync('/etc/ssl/certs/server.cert'),
};

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Middleware to serve static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware to handle form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve the form page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const formData = req.body;
    console.log('Form Data Submitted:', formData);

    try {
        // Save data to PostgreSQL
        const query = `
            INSERT INTO students (first_name, last_name, school, phone, mother_name, mother_phone, father_name, father_phone, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        const values = [
            formData['first-name'],
            formData['last-name'],
            formData['school'],
            formData['phone'],
            formData['mother-name'],
            formData['mother-phone'],
            formData['father-name'],
            formData['father-phone'],
            new Date(), // Current timestamp
        ];

        await pool.query(query, values);
        res.send('Заявка успешно отправлена и сохранена в базе данных! Спасибо.');
    } catch (err) {
        console.error('Error saving submission:', err);
        res.status(500).send('Ошибка при отправке заявки. Пожалуйста, попробуйте снова позже.');
    }
});

// Password-protected route for viewing data
app.use('/data', basicAuth({
    users: { 'admin': 'supersecret' },
    challenge: true,
}));

// Route to serve the data.html page
app.get('/data', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'data.html'));
});

// Route to fetch student data
app.get('/api/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ error: 'Error fetching submissions' });
    }
});

// Route to export student data to XLSX
app.get('/export', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students');
        const students = result.rows;

        // Create a new workbook and add a worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(students);

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

        // Write the workbook to a buffer
        const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

        // Set headers to prompt download
        res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Send the Excel file
        res.send(buffer);
    } catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ error: 'Error exporting data' });
    }
});

// Start the HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Server running securely on port ${PORT}`);
});
