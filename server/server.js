/**
 * Simple Express backend:
 * - POST /api/analyze  => stores submission and returns analysis JSON
 * Submissions stored in server/submissions.json
 * Replace placeholderAnalyze() with calls to NAQUIM + AI inference.
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const STORAGE = path.join(__dirname, 'submissions.json');

// ensure storage file exists
fs.ensureFileSync(STORAGE);
if (!fs.readJsonSync(STORAGE, {throws:false})) fs.writeJsonSync(STORAGE, []);

// POST /api/analyze
app.post('/api/analyze', async (req, res) => {
  try {
    const { location, timestamp } = req.body || {};
    if (!location) return res.status(400).json({ error: 'location required' });

    const record = { id: Date.now(), location, timestamp: timestamp || new Date().toISOString() };

    // Store submission
    const arr = await fs.readJson(STORAGE).catch(()=>[]);
    arr.push(record);
    await fs.writeJson(STORAGE, arr, { spaces: 2 });

    // Placeholder analysis — replace with actual NAQUIM call / AI inference
    const analysis = placeholderAnalyze(location);

    const out = Object.assign({ location }, analysis, { reportTime: new Date().toISOString() });
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/api/submissions', async (req, res) => {
  const arr = await fs.readJson(STORAGE).catch(()=>[]);
  res.json(arr);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/* ---------------- placeholderAnalyze ----------------
 Replace this function with:
 1) geocoding (if you accept place names) -> lat/lon
 2) call NAQUIM map tiles / dataset for that lat/lon
 3) apply your AI model to predict depth/yield/quality
 4) return structured result { verdict, estimatedDepth, estimatedYield, recommendedTechnique, qualityNote }
*/
function placeholderAnalyze(location) {
  // deterministic pseudo-random for demo
  let hash = 0;
  for (let i = 0; i < location.length; i++) hash = ((hash << 5) - hash) + location.charCodeAt(i);
  const r = Math.abs(hash) % 100;
  const verdict = r < 55 ? 'go' : r < 85 ? 'caution' : 'no-go';
  const estimatedDepth = 10 + (r % 60);
  const estimatedYield = Math.max(0, Math.round((100 - (r % 90)) * 8));
  const recommendedTechnique = estimatedDepth > 45 ? 'Percussion + casing' : 'Rotary drilling';
  const qualityNote = (r % 7 === 0) ? 'High salinity (treatment advised)' : (r % 5 === 0) ? 'Moderate hardness' : 'Typical regional quality';

  return { verdict, estimatedDepth, estimatedYield, recommendedTechnique, qualityNote };
}
