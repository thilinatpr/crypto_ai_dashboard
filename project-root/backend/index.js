import express from 'express';
import cors from 'cors';
import { Moralis } from 'moralis';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

const TOKENS = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678', // Dummy token
    chain: 'eth',
  },
];

const USD_THRESHOLD = 100000;

app.get('/whale-transfers', async (req, res) => {
  try {
    let whaleTransfers = [];

    // Dummy transfer data
    whaleTransfers = [
      {
        token: 'DUMMY',
        amount: 1000,
        from: '0xabc123',
        to: '0xdef456',
        valueUsd: 120000,
        timestamp: Date.now() / 1000, // Current time
      },
    ];

    res.json(whaleTransfers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching transfers' });
  }
});

app.listen(PORT, () => console.log(`Whale tracker API running on port ${PORT}`));
