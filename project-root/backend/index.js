import express from 'express';
import cors from 'cors';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

// Check if API key exists
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;
if (!MORALIS_API_KEY) {
  console.error('MORALIS_API_KEY is not set in environment variables');
  process.exit(1);
}

const TOKENS = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678', // Dummy token
    chain: 'eth',
  },
];

const USD_THRESHOLD = 100000;

// Initialize Moralis
const startServer = async () => {
  try {
    // Log the API key (first few characters for debugging)
    console.log(`Using Moralis API key: ${MORALIS_API_KEY.substring(0, 5)}...`);
    
    // Initialize Moralis with the API key
    await Moralis.start({
      apiKey: MORALIS_API_KEY,
    });
    
    console.log('Moralis initialized successfully');
    
    // Root endpoint for healthcheck
    app.get('/', (req, res) => {
      res.json({ status: 'Whale tracker API is running' });
    });

    app.get('/whale-transfers', async (req, res) => {
      try {
        // For now, return dummy data since we're still troubleshooting the API
        const whaleTransfers = [
          {
            token: 'ETH',
            amount: 1000,
            from: '0xabc123',
            to: '0xdef456',
            valueUsd: 120000,
            timestamp: Date.now() / 1000, // Current time
          },
        ];

        res.json(whaleTransfers);
        
        // Test the API separately and log the result
        try {
          const chain = EvmChain.ETHEREUM;
          const address = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // USDT token
          
          console.log('Testing Moralis API with:', { chain, address });
          
          const response = await Moralis.EvmApi.token.getTokenTransfers({
            address,
            chain,
            limit: 1,
          });
          
          console.log('Moralis API test successful:', response.result.length > 0);
        } catch (testError) {
          console.error('Moralis API test failed:', testError);
        }
      } catch (err) {
        console.error('Error fetching transfers:', err);
        res.status(500).json({ error: 'Error fetching transfers', details: err.message });
      }
    });

    app.listen(PORT, () => console.log(`Whale tracker API running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to initialize Moralis:', error);
    process.exit(1);
  }
};

startServer();