// Frontend behavior: minimal, clean, and ready to adapt.
// Update API_BASE to your backend URL (e.g. https://your-backend.onrender.com)
const API_BASE = (location.hostname === 'localhost' ? 'http://localhost:4000' : '');

document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('siteForm');
const locationInput = document.getElementById('location');
const analyzeBtn = document.getElementById('analyzeBtn');
const sampleBtn = document.getElementById('sampleBtn');
const resultCard = document.getElementById('resultCard');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await submitLocation(locationInput.value.trim());
});

sampleBtn.addEventListener('click', async () => {
  // demo sample location
  await submitLocation('Shirur, Pune');
});

// CTA area
document.getElementById('ctaBtn').addEventListener('click', async () => {
  const val = document.getElementById('ctaLocation').value.trim();
  if (!val) return alert('Enter a location to analyze');
  await submitLocation(val);
});

async function submitLocation(locationText) {
  if (!locationText) {
    alert('Please enter a location');
    return;
  }

  showLoading(true);
  showResult(null);

  try {
    const payload = { location: locationText, timestamp: new Date().toISOString() };
    // call backend if available, else fall back to local placeholder
    let res;
    if (API_BASE) {
      const r = await fetch(API_BASE + '/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      res = await r.json();
    } else {
      // local placeholder (same format as server)
      res = localPlaceholderAnalyze(locationText);
      await delay(700);
    }
    showResult(res);
  } catch (err) {
    console.error(err);
    alert('Server error. Check console.');
  } finally {
    showLoading(false);
  }
}

function showLoading(isLoading) {
  analyzeBtn.disabled = isLoading;
  analyzeBtn.textContent = isLoading ? 'Analyzing...' : '[[CALL-TO-ACTION]]';
}

function showResult(data) {
  if (!data) {
    resultCard.classList.add('hidden');
    resultCard.innerHTML = '';
    return;
  }
  resultCard.classList.remove('hidden');

  const verdictBadge = `<div style="font-weight:800;color:${data.verdict === 'go' ? '#064e3b' : data.verdict === 'no-go' ? '#7f1d1d' : '#92400e'}">${data.verdict.toUpperCase()}</div>`;

  resultCard.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
      <div>
        <div style="font-size:16px;font-weight:700">${data.location}</div>
        <div style="color:#64748b;font-size:13px">Report time: ${new Date(data.reportTime).toLocaleString()}</div>
      </div>
      <div>${verdictBadge}</div>
    </div>

    <hr style="margin:12px 0;border:none;border-top:1px solid #eef2f7">

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
      <div style="background:#fafafa;padding:10px;border-radius:8px">
        <div style="font-size:13px;color:#64748b">Estimated depth</div>
        <div style="font-weight:700">${data.estimatedDepth} m</div>
      </div>
      <div style="background:#fafafa;padding:10px;border-radius:8px">
        <div style="font-size:13px;color:#64748b">Estimated yield</div>
        <div style="font-weight:700">${data.estimatedYield} L/hr</div>
      </div>
      <div style="background:#fafafa;padding:10px;border-radius:8px">
        <div style="font-size:13px;color:#64748b">Water quality note</div>
        <div style="font-weight:700">${data.qualityNote}</div>
      </div>
    </div>

    <div style="margin-top:12px">
      <strong>Recommended drilling technique:</strong> ${data.recommendedTechnique}
    </div>
  `;
}

/* --------- Placeholder analysis generator (client-side demo) --------- */
function localPlaceholderAnalyze(location) {
  // simple deterministic pseudo-randomness based on text
  let hash = 0;
  for (let i = 0; i < location.length; i++) hash = ((hash << 5) - hash) + location.charCodeAt(i);
  const r = Math.abs(hash) % 100;

  // verdict logic: low -> go, mid -> caution, high -> no-go
  const verdict = r < 55 ? 'go' : r < 85 ? 'caution' : 'no-go';
  const depth = 10 + (r % 60); // 10..70 m
  const yield = Math.max(0, Math.round((100 - (r % 90)) * 8)); // arbitrary L/hr
  const qualityNote = (r % 7 === 0) ? 'High salinity (treatment advised)' : (r % 5 === 0) ? 'Moderate hardness' : 'Typical regional quality';

  const technique = depth > 45 ? 'Percussion + bore casing' : 'Rotary drilling recommended';

  return {
    location,
    reportTime: new Date().toISOString(),
    verdict,
    estimatedDepth: depth,
    estimatedYield: yield,
    recommendedTechnique: technique,
    qualityNote
  };
}

function delay(ms){return new Promise(r=>setTimeout(r,ms))}
