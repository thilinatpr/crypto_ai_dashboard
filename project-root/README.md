# Whale Tracker MVP

## Overview

A minimal Whale Tracker app that tracks large transfers of specific tokens using the Moralis SDK.

## Backend

- Express server fetches data using the Moralis Web3 API.
- Fetches whale transfers over a threshold (e.g., $100K).

## Frontend

- Svelte frontend that displays whale transfers in a table.
- Auto-refreshes every 30 seconds.
