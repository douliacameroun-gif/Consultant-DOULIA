import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import Airtable from "airtable";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Airtable Setup
const AIRTABLE_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;

if (!AIRTABLE_KEY || !AIRTABLE_BASE) {
  console.warn("⚠️ ATTENTION : Paramètres Airtable manquants (AIRTABLE_API_KEY ou AIRTABLE_BASE_ID). La sauvegarde est désactivée.");
}

const base = AIRTABLE_KEY ? new Airtable({ apiKey: AIRTABLE_KEY }).base(AIRTABLE_BASE!) : null;

// --- Système de Notification WhatsApp (via Avlytext) ---
// Documentation : https://avlytext.com/api
const AVLYTEXT_API_KEY = process.env.AVLYTEXT_API_KEY;
const AVLYTEXT_URL = process.env.AVLYTEXT_URL || 'https://api.avlytext.com/external/whatsapp/send';
const ADMIN_NUMBER = '237673043127'; // Ton numéro expert (sans + pour certaines API)

async function sendNotification(title: string, body: string) {
  // On ne bloque jamais le reste de l'application (pas d'await lors de l'appel)
  console.log(`[DOULIA Alert] Notification préparée : \n📌 ${title}\n📝 ${body}`);
  
  if (AVLYTEXT_API_KEY) {
    // Un deuxième try-catch interne pour isoler totalement le service Avlytext
    try {
      const response = await fetch(AVLYTEXT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: AVLYTEXT_API_KEY,
          phone: ADMIN_NUMBER,
          text: `🔔 *ALERTE DOULIA*\n\n*${title}*\n\n${body}`
        })
      });
      
      // Vérification du statut HTTP avant de tenter de parser le JSON
      if (!response.ok) {
        console.error(`⚠️ Avlytext a répondu avec une erreur (${response.status}). Vérifiez votre solde.` );
        return;
      }

      const textResponse = await response.text();
      try {
        const result = JSON.parse(textResponse);
        console.log("✅ Réponse Avlytext (JSON):", result);
        // Si le solde est insuffisant, Avlytext renvoie souvent un code de succès HTTP mais un message d'erreur dans le corps JSON
        if (result.status === 'error' || result.error) {
          console.error("⚠️ Erreur logique Avlytext (Probable solde à 0 FCFA):", result);
        }
      } catch (e) {
        console.log("✅ Réponse Avlytext (Texte):", textResponse);
      }
      
      console.log("✅ Processus de notification Avlytext terminé.");
    } catch (err) {
      // Si Avlytext est en panne ou si la connexion échoue, on log simplement sans crasher
      console.error("❌ Échec critique de connexion à Avlytext (Ignoré pour préserver l'app):", err);
    }
  } else {
    console.warn("⚠️ Avlytext non configuré. Alerte réelle envoyée au log serveur uniquement.");
  }
}
// -------------------------------------------------

// Tavily Search Helper
async function searchWeb(query: string) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ Clé Tavily manquante.");
    return "Recherche web non disponible.";
  }
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        max_results: 3
      })
    });
    const data = await response.json();
    return JSON.stringify(data.results || []);
  } catch (error) {
    console.error("Tavily Error:", error);
    return "Erreur recherche web.";
  }
}

const SYSTEM_INSTRUCTION = `
[RÔLE ET IDENTITÉ]
Tu es "l'Expert Consultant DOULIA", une IA de précision spécialisée dans la transformation digitale et l'intégration de l'Intelligence Artificielle pour les entreprises au Cameroun. 
Ton ton est ultra-professionnel, visionnaire, et profondément ancré dans le progrès technologique. Tu incarnes le "DOULIA Love" : empathie, pragmatisme et ambition pour tes clients.

[VOTRE MISSION]
Transformer les défis des entrepreneurs en opportunités de croissance exponentielle grâce à l'IA. Tu ne vends pas juste des outils, tu construis le futur des entreprises camerounaises.

[GESTION DES RECHERCHES - TAVILY]
Tu as accès à une recherche web via Tavily. Utilise-la EXCLUSIVEMENT quand l'utilisateur demande des actualités récentes ou des données de marché spécifiques. Synthétise toujours l'information.

[RÈGLES DE FORMATAGE]
- __Gras__ pour les concepts clés (Utilise doubles underscores). Pas d'astérisques (*). 
- Liste avec ❶, ❷, ❸ pour structurer.
- Doubles sauts de ligne systématiques.
`;

// API Routes
app.post("/api/chat", async (req, res) => {
  const { message, history, visitorId, conversationId } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Clé API Gemini manquante côté serveur." });
  }

  try {
    const genAI = new GoogleGenAI({ apiKey }) as any;
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{
        functionDeclarations: [{
          name: "searchWeb",
          description: "Recherche sur le web pour obtenir des informations récentes.",
          parameters: {
            type: "object",
            properties: {
              query: { type: "string" }
            },
            required: ["query"]
          }
        }]
      }]
    });

    const chat = model.startChat({
      history: history.map((h: any) => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: h.parts
      }))
    });

    let result = await chat.sendMessage(message);
    let response = result.response;
    const calls = response.functionCalls ? response.functionCalls() : [];

    if (calls && calls.length > 0) {
      const toolResponse = await searchWeb(calls[0].args.query as string);
      result = await chat.sendMessage([{
        functionResponse: {
          name: "searchWeb",
          response: { content: toolResponse }
        }
      }]);
      response = result.response;
    }

    const aiText = response.text();

    // Save to Airtable (Asynchronously)
    if (base) {
      (async () => {
        try {
          console.log(`[Airtable] Tentative de sauvegarde message pour Visitor: ${visitorId}`);
          
          // 1. Ensure Visitor exists
          const visitors = await base('Visiteurs').select({
            filterByFormula: `{ID Visiteur} = '${visitorId}'`
          }).firstPage();

          let visitorRecordId;
          if (visitors.length === 0) {
            console.log(`[Airtable] Nouveau visiteur détecté: ${visitorId}`);
            const newVisitor = await base('Visiteurs').create({
              "ID Visiteur": visitorId,
              "Date de première visite": new Date().toISOString(),
              "Source": req.headers['referer'] || "Web"
            });
            visitorRecordId = newVisitor.id;
          } else {
            visitorRecordId = visitors[0].id;
          }

          // 2. Ensure Conversation exists
          const conversations = await base('Conversations').select({
            filterByFormula: `{ID Chat} = '${conversationId}'`
          }).firstPage();

          let conversationRecordId;
          if (conversations.length === 0) {
            console.log(`[Airtable] Nouvelle conversation: ${conversationId}`);
            const newConv = await base('Conversations').create({
              "ID Chat": conversationId,
              "Visiteur": [visitorRecordId],
              "Date de début": new Date().toISOString(),
              "Statut": "En cours"
            });
            conversationRecordId = newConv.id;
          } else {
            conversationRecordId = conversations[0].id;
          }

          // 3. Save Messages
          const extractLinks = (text: string) => {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            return text.match(urlRegex)?.join(', ') || '';
          };

          await base('Messages').create([
            {
              fields: {
                "ID Message": `msg_u_${Date.now()}`,
                "Conversation": [conversationRecordId],
                "Rôle": "Utilisateur",
                "Contenu": message,
                "Liens Partagés": extractLinks(message),
                "Timestamp": new Date().toISOString()
              }
            },
            {
              fields: {
                "ID Message": `msg_ia_${Date.now()}`,
                "Conversation": [conversationRecordId],
                "Rôle": "IA",
                "Contenu": aiText,
                "Liens Partagés": extractLinks(aiText),
                "Timestamp": new Date().toISOString()
              }
            }
          ]);
          console.log(`[Airtable] Messages sauvegardés avec succès pour ${conversationId}`);
        } catch (err) {
          console.error("❌ Erreur Flux Airtable (Chat):", err);
        }
      })();
    }

    res.json({ text: aiText });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: "Erreur lors de la conversation IA." });
  }
});

// --- Route DLR Avlytext ---
app.post("/api/avlytext-dlr", (req, res) => {
  console.log("📥 [DLR Avlytext Local] Rapport reçu :", req.body);
  res.status(200).send("DLR Received");
});
// --------------------------

app.post("/api/audit", async (req, res) => {
  const { auditData, visitorId } = req.body;

  if (base) {
    try {
      console.log(`[Airtable] Reception d'un audit pour Visitor: ${visitorId}`);
      // 1. Find Visitor
      const visitors = await base('Visiteurs').select({
        filterByFormula: `{ID Visiteur} = '${visitorId}'`
      }).firstPage();

      let visitorRecordId;
      if (visitors.length > 0) {
        visitorRecordId = visitors[0].id;
        console.log(`[Airtable] Mise à jour du visiteur existant: ${visitorId}`);
        // Update visitor info from audit
        await base('Visiteurs').update(visitorRecordId, {
          "Nom Prénom": auditData.name,
          "WhatsApp": auditData.whatsapp,
          "Entreprise": auditData.company
        });
      } else {
        console.log(`[Airtable] Création d'un visiteur pour l'audit: ${visitorId}`);
        const newVisitor = await base('Visiteurs').create({
          "ID Visiteur": visitorId,
          "Nom Prénom": auditData.name,
          "WhatsApp": auditData.whatsapp,
          "Entreprise": auditData.company,
          "Date de première visite": new Date().toISOString(),
          "Source": req.headers['referer'] || "Audit"
        });
        visitorRecordId = newVisitor.id;
      }

      // 2. Create Audit
      console.log(`[Airtable] Création de l'audit pour ${visitorId}`);
      const audit = await base('Audits').create({
        "ID Audit": `audit_${Date.now()}`,
        "Visiteur": [visitorRecordId],
        "Défi Majeur": auditData.challenge === 'service_client' ? 'Service Client' : 
                       auditData.challenge === 'admin' ? 'Admin' : 
                       auditData.challenge === 'data' ? 'Data' : 'Sur-Mesure',
        "Description du Problème": auditData.description,
        "Logiciels Actuels": auditData.software || auditData.existingTools,
        "Volume de messages": parseInt(auditData.volume || "0"),
        "Priorité": auditData.priority === 'haute' ? 'Haute' : 
                    auditData.priority === 'moyenne' ? 'Moyenne' : 'Basse',
        "Date de soumission": new Date().toISOString()
      });

      // 3. Create Suggested Solution (Table 5)
      let suggestedProduct = "";
      if (auditData.challenge === 'service_client') suggestedProduct = "Connect";
      else if (auditData.challenge === 'admin') suggestedProduct = "Process";
      else if (auditData.challenge === 'data') suggestedProduct = "Insight";
      else suggestedProduct = "Sur-Mesure";

      await base('Solutions suggérées').create({
        "ID Solution": `sol_${Date.now()}`,
        "Audit": [audit.id],
        "Produit": suggestedProduct,
        "Note de pertinence": 9 // Default high relevance for audit-generated solutions
      });

      console.log(`[Airtable] Audit et Solution sauvegardés avec succès pour ${visitorId}`);
      
      // Trigger Notification
      sendNotification(
          `Nouvel Audit: ${auditData.company}`,
          `Prospect: ${auditData.name} - WhatsApp: ${auditData.whatsapp} - Défi: ${auditData.challenge}`
      );

      res.json({ success: true });
    } catch (error) {
      console.error("❌ Erreur Flux Airtable (Audit):", error);
      res.status(500).json({ error: "Erreur lors de la sauvegarde de l'audit." });
    }
  } else {
    console.warn("⚠️ Base Airtable non initialisée lors de l'audit.");
    res.json({ success: true, warning: "Airtable non configuré" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
