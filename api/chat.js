import { GoogleGenAI, Type } from "@google/genai";
import Airtable from "airtable";

// Initialisation Airtable avec fallback ID Base fourni par l'utilisateur
const AIRTABLE_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID || "appB3GIl261KpVz3F";
const base = AIRTABLE_KEY ? new Airtable({ apiKey: AIRTABLE_KEY }).base(AIRTABLE_BASE) : null;

// Tavily Search Helper
async function searchWeb(query) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return "Recherche web non disponible.";
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, query, max_results: 3 })
    });
    const data = await response.json();
    return JSON.stringify(data.results || []);
  } catch (error) {
    return "Erreur recherche web.";
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { message, history, visitorId, conversationId, hasPassedAudit } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;

  if (!message || !apiKey) {
    return res.status(400).json({ error: 'Message ou Clé API manquante.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    let systemInstruction = `[RÔLE ET IDENTITÉ]
Tu es "l'Expert Consultant DOULIA", une IA de précision spécialisée dans la transformation digitale et l'intégration de l'Intelligence Artificielle pour les entreprises au Cameroun. 
Ton ton est ultra-professionnel, visionnaire, et profondément ancré dans le progrès technologique. Tu incarnes le "DOULIA Love" : empathie, pragmatisme et ambition pour tes clients.

[GESTION DES RECHERCHES - TAVILY]
Tu as accès à une recherche web via Tavily. Utilise-la EXCLUSIVEMENT quand l'utilisateur demande des actualités récentes ou des données de marché spécifiques. Synthétise toujours l'information.

[RÈGLES DE FORMATAGE]
1. __Gras__ pour les concepts clés (Utilise doubles underscores). Pas d'astérisques (*). 
2. Liste avec ❶, ❷, ❸ pour structurer.
3. Doubles sauts de ligne systématiques.`;

    if (hasPassedAudit) {
      systemInstruction += `\n\n[NOTE CRITIQUE - AUDIT DÉJÀ RÉALISÉ]\nL'utilisateur a DÉJÀ complété son audit.\n1. NE propose PLUS de passer l'audit.\n2. NE propose PLUS de contacter l'équipe via WhatsApp.\n3. Concentre-toi sur le CONSEIL technique et stratégique.`;
    } else {
      systemInstruction += `\n\n[PHASE DE CLÔTURE]\nSi le client demande le formulaire ou si l'audit est fini, tu DOIS :\nÉtape 1 : Le Résumé "Format Code" (ex: audit_ia_auto).\nÉtape 2 : Boutons Markdown [Audit](...) et [WhatsApp](...).`;
    }

    const formattedHistory = (history || []).map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: Array.isArray(h.parts) ? h.parts : [{ text: h.parts }]
    }));

    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: { 
        systemInstruction,
        tools: [{
          functionDeclarations: [{
            name: "searchWeb",
            description: "Recherche sur le web pour obtenir des informations récentes sur le marché camerounais ou l'IA.",
            parameters: {
              type: Type.OBJECT,
              properties: { query: { type: Type.STRING } },
              required: ["query"]
            }
          }]
        }],
      },
      history: formattedHistory,
    });

    let result = await chat.sendMessage({ message });
    let aiText = result.text || "";

    if (result.functionCalls && result.functionCalls.length > 0) {
      const toolResponse = await searchWeb(result.functionCalls[0].args.query);
      const secondResult = await chat.sendMessage({
        message: [{ functionResponse: { name: "searchWeb", response: { content: toolResponse } } }]
      });
      aiText = secondResult.text || "";
    }

    // Sauvegarde Airtable Asynchrone (pour ne pas bloquer la réponse)
    if (base && visitorId && conversationId) {
      (async () => {
        try {
          console.log(`[Airtable] Sauvegarde chat pour ${visitorId}`);
          // Logique Airtable robuste
          const visitors = await base('Visiteurs').select({ filterByFormula: `{ID Visiteur} = '${visitorId}'` }).firstPage();
          let visitorRid;
          
          if (visitors.length > 0) {
            visitorRid = visitors[0].id;
          } else {
            const nv = await base('Visiteurs').create({ 
              "ID Visiteur": visitorId, 
              "Date de première visite": new Date().toISOString(), 
              "Source": "Chat" 
            });
            visitorRid = nv.id;
          }

          const convs = await base('Conversations').select({ filterByFormula: `{ID Chat} = '${conversationId}'` }).firstPage();
          let convRid;
          
          if (convs.length > 0) {
            convRid = convs[0].id;
          } else {
            const nc = await base('Conversations').create({ 
              "ID Chat": conversationId, 
              "Visiteur": [visitorRid], 
              "Date de début": new Date().toISOString(), 
              "Statut": "En cours" 
            });
            convRid = nc.id;
          }

          await base('Messages').create([
            { fields: { "ID Message": `msg_u_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`, "Conversation": [convRid], "Rôle": "Utilisateur", "Contenu": message, "Timestamp": new Date().toISOString() } },
            { fields: { "ID Message": `msg_ia_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`, "Conversation": [convRid], "Rôle": "IA", "Contenu": aiText, "Timestamp": new Date().toISOString() } }
          ]);
          console.log("✅ Airtable Save Success");
        } catch (e) { 
          console.error("❌ Airtable Error in Serverless Handler:", e.message); 
        }
      })();
    }

    return res.status(200).json({ text: aiText });
  } catch (error) {
    console.error("SDK Error:", error);
    res.status(500).json({ error: "Interruption technique.", details: error.message });
  }
}
