export async function getDiagnosis(ed_history: string, oph_soc_history: string) {
  try {
    const response = await fetch("http://127.0.0.1:8000/chatbot/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ed_history, oph_soc_history }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch diagnosis:", error);
    return null;
  }
}
