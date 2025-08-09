const express = require('express');
const cors = require('cors');
const { analyzeLocationNAQUIM } = require('./naquimLoader');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/analyze-location', async (req, res) => {
  const { location } = req.body;
  if (!location) return res.status(400).json({ error: 'location required' });

  try {
    const result = await analyzeLocationNAQUIM(location);
    res.json({ location, ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'analysis error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
