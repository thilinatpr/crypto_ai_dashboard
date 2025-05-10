import express from 'express';
import cors from 'cors';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

// Initialize Moralis (runs once per cold start)
const startMoralis = async () => {
  try {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
    console.log("Moralis initialized");
  } catch (e) {
    console.error("Moralis failed:", e);
  }
};
startMoralis();

// Routes
app.get("/", (req, res) => {
  res.json({ status: "Whale Tracker API" });
});

app.get("/whale-transfers", async (req, res) => {
  try {
    // Example Moralis API call
    const response = await Moralis.EvmApi.token.getTokenTransfers({
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
      chain: EvmChain.ETHEREUM,
      limit: 5,
    });
    res.json(response.toJSON());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Export as Vercel serverless function
export default app;