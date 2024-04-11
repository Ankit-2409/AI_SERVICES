const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Load user data from a JSON file
let userData = [];
try {
    const userDataPath = path.join(__dirname, 'data', 'users.json');
    if (fs.existsSync(userDataPath)) {
        const userDataJson = fs.readFileSync(userDataPath, 'utf8');
        userData = JSON.parse(userDataJson);
    }
} catch (err) {
    console.error('Error loading user data:', err);
}

app.get('/users', (req, res) => {
    res.json(userData);
});

app.post('/signup', (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;
    if (!firstName || !lastName || !email || !password || !phone) {
        res.status(400).send("Please fill in all fields.");
    } else {
        const newUser = {
            id: userData.length + 1,
            firstName,
            lastName,
            email,
            password,
            phone
        };
        userData.push(newUser);
        try {
            const userDataPath = path.join(__dirname, 'data', 'users.json');
            fs.writeFileSync(userDataPath, JSON.stringify(userData, null, 2));
            res.status(201).send("Signed up successfully!");
        } catch (err) {
            console.error('Error saving user data:', err);
            res.status(500).send("Error signing up.");
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
