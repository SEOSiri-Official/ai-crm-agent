export async function syncNotion(token: string, dbId: string) {
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({ page_size: 10 })
  });
  const data = await res.json();
  return (data.results || []).map((p: any) => {
    const props = p.properties as any;
    const title = Object.values(props).find((v: any) => v.type === 'title') as any;
    return {
      id: p.id,
      name: title?.title[0]?.plain_text || "Strategic Lead",
      email: props.Email?.email || "info@seosiri.com",
      url: p.url
    };
  });
}

export async function updateNotion(token: string, pageId: string, strategy: string) {
  return await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      properties: {
        'Status': { select: { name: 'AI Analyzed' } },
        'AI_Strategy': { rich_text: [{ text: { content: strategy.substring(0, 2000) } }] }
      }
    })
  });
}