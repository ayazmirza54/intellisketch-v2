const express = require('express');
const cors = require('cors');
const { SERVER_URL, PORT, ENV } = require('./config/constants');
const router = require('./routes/calculator');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Server is running" });
});

app.use('/calculate', router);

app.listen(PORT, SERVER_URL, () => {
    console.log(`Server running on http://${SERVER_URL}:${PORT} in ${ENV} mode`);
});