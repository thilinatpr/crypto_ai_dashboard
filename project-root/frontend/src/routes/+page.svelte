<script>
  import { onMount } from 'svelte';
  let whaleTransfers = [];

  async function fetchWhaleTransfers() {
    const res = await fetch('http://localhost:3001/whale-transfers');
    if (res.ok) {
      whaleTransfers = await res.json();
    } else {
      console.error('Failed to fetch whale transfers');
    }
  }

  onMount(() => {
    fetchWhaleTransfers();
    setInterval(fetchWhaleTransfers, 30000); // Refresh every 30 seconds
  });
</script>

<style>
  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f7f7f7;
  }

  .container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
</style>

<div class="container">
  <h1>Whale Tracker Dashboard</h1>
  <table>
    <thead>
      <tr>
        <th>Token</th>
        <th>Amount</th>
        <th>From</th>
        <th>To</th>
        <th>Value (USD)</th>
        <th>Timestamp</th>
      </tr>
    </thead>
    <tbody>
      {#each whaleTransfers as { token, amount, from, to, valueUsd, timestamp }}
        <tr>
          <td>{token}</td>
          <td>{amount}</td>
          <td>{from}</td>
          <td>{to}</td>
          <td>{valueUsd}</td>
          <td>{new Date(timestamp * 1000).toLocaleString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
