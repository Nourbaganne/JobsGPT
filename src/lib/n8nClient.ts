export async function triggerN8nSearch(userId: number) {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("N8N_WEBHOOK_URL is not defined");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      console.error("Failed to trigger n8n search", await response.text());
    }
  } catch (error) {
    console.error("Error triggering n8n search", error);
  }
}
