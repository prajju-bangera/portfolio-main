require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Serve Static Files from Frontend Folder
const publicPath = path.join(__dirname, '../frontend'); // Adjust the path
app.use(express.static(publicPath));

console.log("✅ Serving static files from:", publicPath);
console.log("✅ Looking for index.html at:", path.join(publicPath, 'index.html'));

// ✅ Ensure MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/PortfolioMessage";

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

// ✅ Define Schema & Model
const formSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});
const Form = mongoose.model('Form', formSchema);

// ✅ Handle Form Submission
app.post('/submit', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newForm = new Form({ name, email, message });
        await newForm.save();
        res.status(201).json({ success: true, message: 'Data saved successfully!' });
    } catch (error) {
        console.error('❌ Error saving data:', error);
        res.status(500).json({ success: false, message: 'Error saving data' });
    }
});

// ✅ Serve index.html explicitly
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'), (err) => {
        if (err) {
            console.error("❌ Error serving index.html:", err);
            res.status(500).send("Error loading the page.");
        }
    });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
