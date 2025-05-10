// api.js: Logic to fetch data from backend
export async function fetchWhaleTransfers() {
  const res = await fetch('http://localhost:3001/whale-transfers');
  if (!res.ok) {
    throw new Error('Failed to fetch whale transfers');
  }
  return res.json();
}
