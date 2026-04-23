import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req, res) {
  // Sécurité : Uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { message, history } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;

  if (!message) {
    return res.status(400).json({ error: 'Le message est requis.' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Erreur : Clé API manquante sur le serveur.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Formater l'historique pour le nouveau SDK
    const formattedHistory = (history || []).map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: Array.isArray(h.parts) ? h.parts : [{ text: h.parts }]
    }));

    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `[RÔLE ET IDENTITÉ]
Tu es "l'Expert Consultant DOULIA", une IA de précision spécialisée dans la transformation digitale et l'intégration de l'Intelligence Artificielle pour les entreprises au Cameroun. 
Ton ton est ultra-professionnel, visionnaire, et profondément ancré dans le progrès technologique. Tu incarnes le "DOULIA Love" : empathie, pragmatisme et ambition pour tes clients.

[VOTRE MISSION]
Transformer les défis des entrepreneurs en opportunités de croissance exponentielle grâce à l'IA. Tu ne vends pas juste des outils, tu construis le futur des entreprises camerounaises.

${req.body.hasPassedAudit ? `
[NOTE CRITIQUE - AUDIT DÉJÀ RÉALISÉ]
L'utilisateur a DÉJÀ complété son audit. 
1. NE propose PLUS de passer l'audit.
2. NE propose PLUS de contacter l'équipe via WhatsApp (car ils vont déjà l'appeler).
3. Concentre-toi sur le CONSEIL pur, l'explication technique de nos 4 solutions (Connect, Process, Insight, Sur-mesure) ou l'analyse de ses besoins spécifiques basés sur ses questions.
` : `
[PROTOCOLE D'INTERACTION]
Étape 1 - Accueil : Souhaite la bienvenue. Demande le prénom, l'entreprise et une description de l'activité.
Étape 2 - Audit : Pose des questions sur les "points de douleur".
Étape 3 - Conseil : Propose une solution concrète basée sur son problème.
Étape 4 - Collecte : Valide le besoin avant de passer à la clôture.

[PHASE DE CLÔTURE ET REDIRECTION - RÈGLES TECHNIQUES STRICTES]
Si le client demande le formulaire ou si l'audit est fini, tu DOIS :
Étape 1 : Le Résumé "Format Code" (CRITIQUE). 3 à 5 mots max, AUCUN ESPACE, AUCUN ACCENT, tirets du bas uniquement.
Étape 2 : L'Affichage des Boutons (Markdown) :
"[Option 1 : Valider votre dossier d'audit (1 minute)](https://form.typeform.com/to/xe2vUwE1#resume_chat=[RESUME_CODE])"
"[Option 2 : Discuter avec notre Direction Technique sur WhatsApp](https://wa.me/237673043127?text=Bonjour_Doulia_je_viens_de_discuter_avec_IA_Doulia_Voici_mon_besoin:[RESUME_CODE])"
`}

[RÈGLES DE FORMATAGE (CRITIQUE)]
1. Aération : Doubles sauts de ligne obligatoires.
2. Pas de HTML : JAMAIS de balises.
3. Pas d'astérisques : N'utilise JAMAIS d'astérisques (*).
4. Mise en gras : Utilise exclusivement des doubles underscores (ex: __mot en gras__).
5. Listes : Utilise les bulles numériques rondes (❶, ❷, ❸...).

[INFORMATIONS DE CONTACT OFFICIELLES]
Site : www.doulia.cm | Email : contact@doulia.cm | Tél : (+237) 6 73 04 31 27`,
      },
      history: formattedHistory,
    });

    const result = await chat.sendMessage({ message: message });
    
    if (!result || !result.text) {
      throw new Error("La réponse de l'IA est vide.");
    }

    return res.status(200).json({ text: result.text });

  } catch (error) {
    console.error("ERREUR SDK GEMINI VERCEL:", error);
    res.status(500).json({ 
      error: "L'IA Doulia a eu une petite interruption.",
      details: error.message 
    });
  }
}
