import express from 'express';
import cors from 'cors';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { createClient } from '@supabase/supabase-js';
import { kv } from '@vercel/kv'; // Vercel's Redis
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // For JSON body parsing

// Initialize services
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const startMoralis = async () => {
  try {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
    console.log("Moralis initialized");
  } catch (e) {
    console.error("Moralis failed:", e);
  }
};
startMoralis();

// --- Routes ---
app.get("/", (req, res) => {
  res.json({ status: "Whale Tracker API" });
});

// Get whale transfers (with Redis caching)
app.get("/whale-transfers", async (req, res) => {
  const CACHE_KEY = 'recent-whale-transfers';
  const CACHE_TTL = 60; // 60 seconds cache

  try {
    // 1. Check Redis cache first
    const cachedData = await kv.get(CACHE_KEY);
    if (cachedData) {
      console.log("Returning cached data");
      return res.json({ source: "cache", data: cachedData });
    }

    // 2. Fetch fresh data from Moralis
    const response = await Moralis.EvmApi.token.getTokenTransfers({
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
      chain: EvmChain.ETHEREUM,
      limit: 5,
    });
    const freshData = response.toJSON();

    // 3. Save to cache (async to avoid blocking response)
    kv.set(CACHE_KEY, freshData, { ex: CACHE_TTL });

    // 4. Save to Supabase (for historical analysis)
    await supabase
      .from('whale_transfers')
      .insert(freshData.result.map(tx => ({
        tx_hash: tx.transaction_hash,
        from_address: tx.from_address,
        to_address: tx.to_address,
        value: tx.value,
        block_timestamp: tx.block_timestamp,
      })));

    res.json({ source: "api", data: freshData });
  } catch (e) {
    console.error("Error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Get historical transfers from Supabase
app.get("/historical-transfers", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('whale_transfers')
      .select('*')
      .order('block_timestamp', { ascending: false })
      .limit(100);

    if (error) throw error;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Export as Vercel serverless function
export default app;