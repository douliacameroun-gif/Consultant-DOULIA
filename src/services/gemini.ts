import { offlineService } from './offlineService';

export const getGeminiResponse = async (
  message: string, 
  history: { role: "user" | "model", parts: { text: string }[] }[], 
  visitorId?: string,
  conversationId?: string,
  hasPassedAudit: boolean = false
) => {
  const payload = { message, history, visitorId, conversationId, hasPassedAudit };
  
  if (typeof window !== 'undefined' && !navigator.onLine) {
    offlineService.queueRequest('chat', payload);
    return "Je suis actuellement en **mode hors-ligne** à cause d'une instabilité du réseau. J'ai bien noté votre message et il sera synchronisé avec nos serveurs dès le retour de la connexion. Pourriez-vous continuer ou me dire autre chose ?";
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur serveur");
    }

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Queue if it's likely a network error
    if (typeof window !== 'undefined') {
      offlineService.queueRequest('chat', payload);
    }
    return "Oups ! La connexion semble instable. J'ai enregistré votre message localement et je le synchroniserai dès que possible. On ne vous lâche pas !";
  }
};

export const saveAuditToAirtable = async (auditData: any, visitorId?: string) => {
  const payload = { auditData, visitorId };

  if (typeof window !== 'undefined' && !navigator.onLine) {
    offlineService.queueRequest('audit', payload);
    return { offline: true, message: "Audit enregistré localement." };
  }

  try {
    const response = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error) {
    console.error("Save Audit Error:", error);
    if (typeof window !== 'undefined') {
      offlineService.queueRequest('audit', payload);
    }
    return { offline: true, error };
  }
};
