const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes/index'));

// Health check
app.get('/', (req, res) => res.json({ status: 'NexaBank API Running ✅', version: '1.0.0' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🏦 NexaBank Server running on http://localhost:${PORT}`));
