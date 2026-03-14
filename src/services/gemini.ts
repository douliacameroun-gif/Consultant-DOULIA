export const getGeminiResponse = async (message: string, history: any[]) => {
  try {
    // On appelle notre route API interne au lieu de Google
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      throw new Error("Erreur réseau lors de l'appel au serveur.");
    }

    const data = await response.json();
    return data.text;
    
  } catch (error) {
    console.error("Erreur de communication avec le serveur DOULIA:", error);
    return "Je suis désolé, je n'arrive pas à me connecter à mon cerveau. Pouvez-vous vérifier votre connexion ?";
  }
};