export async function fetchMarket(gToken?: string) {
  if (!gToken) return { keywords: ["Unauthorized"], intentScore: 65 };
  const res = await fetch('https://www.googleapis.com/webmasters/v3/sites/https%3A%2F%2Fseosiri.com/searchAnalytics/query', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${gToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ startDate: '2024-01-01', endDate: '2024-04-20', dimensions: ['query'], rowLimit: 5 })
  });
  const data = await res.json();
  return { 
    keywords: data.rows?.map((r: any) => r.keys[0]) || ["SEO Sync Pending"], 
    intentScore: 94 
  };
}