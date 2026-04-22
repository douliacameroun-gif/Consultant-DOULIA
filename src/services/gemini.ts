export const getGeminiResponse = async (
  message: string, 
  history: { role: "user" | "model", parts: { text: string }[] }[], 
  visitorId?: string,
  conversationId?: string
) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, visitorId, conversationId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur serveur");
    }

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "Désolé, je rencontre une difficulté technique. Je reste à votre écoute !";
  }
};

export const saveAuditToAirtable = async (auditData: any, visitorId?: string) => {
  try {
    const response = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auditData, visitorId })
    });
    return await response.json();
  } catch (error) {
    console.error("Save Audit Error:", error);
    return { error };
  }
};
