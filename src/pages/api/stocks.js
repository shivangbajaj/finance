// src/pages/api/stocks.js
import { spawn } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  const { ticker } = req.query;

  if (!ticker) {
    return res.status(400).json({ error: 'Ticker is required' });
  }

  const scriptPath = path.resolve('src/scripts/fetch_stock.py');

  const process = spawn('python', [scriptPath, ticker]);

  let data = '';
  let error = '';

  process.stdout.on('data', (chunk) => {
    data += chunk;
  });

  process.stderr.on('data', (chunk) => {
    error += chunk;
  });

  process.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: `Python script failed with code ${code}: ${error}` });
    }
    try {
      const parsedData = JSON.parse(data);

      // Disable caching
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      res.status(200).json(parsedData);
    } catch (err) {
      res.status(500).json({ error: 'Failed to parse JSON from Python script output' });
    }
  });
}
