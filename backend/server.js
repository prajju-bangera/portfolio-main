require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve static files (index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB 
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Define Schema & Model
const formSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});
const Form = mongoose.model('Form', formSchema);

// Handle form submission
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
