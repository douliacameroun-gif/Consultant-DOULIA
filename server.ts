import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import Airtable from "airtable";
import dotenv from "dotenv";

dotenv.config();
console.log("🚀 [Server] Environnement chargé.");
console.log("🔑 [Airtable] Key status:", !!process.env.AIRTABLE_API_KEY ? "CONFIGURÉ" : "MANQUANT");
console.log("🔑 [Airtable] Base ID status:", !!process.env.AIRTABLE_BASE_ID ? "CONFIGURÉ" : "MANQUANT");

const app = express();
app.use(express.json());
const PORT = 3000;

// Airtable Setup
const AIRTABLE_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID || "appB3GIl261KpVz3F";

if (!AIRTABLE_KEY) {
  console.warn("⚠️ ATTENTION : AIRTABLE_API_KEY manquante. La sauvegarde est désactivée.");
}

const base = AIRTABLE_KEY ? new Airtable({ apiKey: AIRTABLE_KEY }).base(AIRTABLE_BASE) : null;

// --- Système de Notification WhatsApp (via Avlytext) ---
// Documentation : https://avlytext.com/api
const AVLYTEXT_API_KEY = process.env.AVLYTEXT_API_KEY;
const AVLYTEXT_URL = process.env.AVLYTEXT_URL || 'https://api.avlytext.com/external/whatsapp/send';
const ADMIN_NUMBER = '237673043127'; // Ton numéro expert (sans + pour certaines API)

async function sendNotification(title: string, body: string) {
  // On ne bloque jamais le reste de l'application (pas d'await lors de l'appel)
  console.log(`[Avlytext] Préparation : \n📌 ${title}\n📝 ${body}`);
  
  if (AVLYTEXT_API_KEY) {
    // Un deuxième try-catch interne pour isoler totalement le service Avlytext
    try {
      const payload = {
        api_key: AVLYTEXT_API_KEY,
        phone: ADMIN_NUMBER,
        text: `🔔 *ALERTE DOULIA*\n\n*${title}*\n\n${body}`
      };

      console.log(`[Avlytext] Envoi à ${AVLYTEXT_URL} pour ${ADMIN_NUMBER}...`);

      const response = await fetch(AVLYTEXT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
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
  console.log(`[Tavily] Tentative de recherche pour : "${query}"`);
  
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
    console.log(`[Tavily] Recherche réussie, ${data.results?.length || 0} résultats.`);
    return JSON.stringify(data.results || []);
  } catch (error) {
    console.error("❌ Tavily Error:", error);
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
app.get("/api/airtable-status", async (req, res) => {
  if (!base) {
    return res.json({ status: "error", message: "Airtable is not configured (missing keys)" });
  }
  
  try {
    // Try to list tables (check if base is accessible)
    await base('Visiteurs').select({ maxRecords: 1 }).firstPage();
    res.json({ 
      status: "ok", 
      message: "Connection confirmed", 
      config: {
        base_id: AIRTABLE_BASE?.substring(0, 5) + "...",
        api_key_set: !!AIRTABLE_KEY
      }
    });
  } catch (err: any) {
    res.status(500).json({ 
      status: "error", 
      message: err.message,
      suggestion: "Vérifiez que le nom de la table 'Visiteurs' existe exactement ainsi dans votre base Airtable."
    });
  }
});

app.get("/api/debug-config", (req, res) => {
  res.json({
    gemini: !!process.env.GEMINI_API_KEY,
    airtable_key: !!process.env.AIRTABLE_API_KEY,
    airtable_base: !!process.env.AIRTABLE_BASE_ID,
    tavily: !!process.env.TAVILY_API_KEY,
    avlytext: !!process.env.AVLYTEXT_API_KEY,
    admin_number: ADMIN_NUMBER
  });
});

app.post("/api/chat", async (req, res) => {
  const { message, history, visitorId, conversationId, hasPassedAudit } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ Erreur : Clé GEMINI_API_KEY manquante.");
    return res.status(500).json({ error: "Clé API Gemini manquante côté serveur." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Instruction dynamique selon le statut de l'audit
    let dynamicInstruction = SYSTEM_INSTRUCTION;
    if (hasPassedAudit) {
      dynamicInstruction += `
[NOTE CRITIQUE - AUDIT DÉJÀ RÉALISÉ]
L'utilisateur a DÉJÀ complété son audit. 
1. NE propose PLUS de passer l'audit.
2. NE propose PLUS de contacter l'équipe via WhatsApp (car ils vont déjà l'appeler).
3. Concentre-toi sur le CONSEIL pur, l'explication technique de nos 4 solutions (Connect, Process, Insight, Sur-mesure) ou l'analyse de ses besoins spécifiques basés sur ses questions.
`;
    } else {
      dynamicInstruction += `
[PHASE DE CLÔTURE ET REDIRECTION - RÈGLES TECHNIQUES STRICTES]
Si le client demande le formulaire ou si l'audit est fini, tu DOIS :
Étape 1 : Le Résumé "Format Code" (CRITIQUE). 3 à 5 mots max, AUCUN ESPACE, AUCUN ACCENT, tirets du bas uniquement.
Étape 2 : L'Affichage des Boutons (Markdown) :
"[Option 1 : Valider votre dossier d'audit (1 minute)](https://form.typeform.com/to/xe2vUwE1#resume_chat=[RESUME_CODE])"
"[Option 2 : Discuter avec notre Direction Technique sur WhatsApp](https://wa.me/237673043127?text=Bonjour_Doulia_je_viens_de_discuter_avec_IA_Doulia_Voici_mon_besoin:[RESUME_CODE])"
`;
    }

    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: Array.isArray(h.parts) ? h.parts : [{ text: h.parts }]
    }));

    const chat = ai.chats.create({
      model: "gemini-3-flash-preview", 
      config: {
        systemInstruction: dynamicInstruction,
        tools: [{
          functionDeclarations: [{
            name: "searchWeb",
            description: "Recherche sur le web pour obtenir des informations récentes sur le marché camerounais ou l'IA.",
            parameters: {
              type: Type.OBJECT,
              properties: {
                query: { type: Type.STRING }
              },
              required: ["query"]
            }
          }]
        }],
      },
      history: formattedHistory
    });

    console.log(`[IA] Envoi du message : ${message.substring(0, 50)}...`);
    let result = await chat.sendMessage({ message: message });
    let aiText = result.text || "";
    console.log(`[IA] Réponse reçue (${aiText.length} chars)`);

    // Gérer les appels de fonction (Tavily)
    const calls = result.functionCalls;
    if (calls && calls.length > 0) {
      console.log(`[IA] Appel de fonction détecté : ${calls[0].name}`);
      const toolResponse = await searchWeb(calls[0].args.query as string);
      
      const secondResult = await chat.sendMessage({
        message: [
          {
            functionResponse: {
              name: "searchWeb",
              response: { content: toolResponse }
            }
          }
        ]
      });
      aiText = secondResult.text || "";
    }

    // Save to Airtable (Asynchronously)
    if (base) {
      (async () => {
        try {
          console.log(`[Airtable] Tentative de sauvegarde message pour Visitor: ${visitorId}`);
          if (!base) throw new Error("Airtable Base not initialized");

          // 1. Ensure Visitor exists
          const visitors = await base('Visiteurs').select({
            filterByFormula: `{ID Visiteur} = '${visitorId}'`
          }).firstPage();

          let visitorRecordId;
          if (visitors.length === 0) {
            console.log(`[Airtable] Nouveau visiteur détecté: ${visitorId}`);
            const newVisitor = await base('Visiteurs').create({
              "ID Visiteur": visitorId,
              "Date de première visite": new Date().toISOString().split('T')[0],
              "Source": "Chat"
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
              "Date de début": new Date().toISOString().split('T')[0],
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
                "ID Message": `msg_u_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                "Conversation": [conversationRecordId],
                "Rôle": "Utilisateur",
                "Contenu": message,
                "Liens Partagés": extractLinks(message),
                "Timestamp": new Date().toISOString()
              }
            },
            {
              fields: {
                "ID Message": `msg_ia_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                "Conversation": [conversationRecordId],
                "Rôle": "IA",
                "Contenu": aiText,
                "Liens Partagés": extractLinks(aiText),
                "Timestamp": new Date().toISOString()
              }
            }
          ]);
          console.log(`[Airtable] ✅ Messages sauvegardés avec succès pour ${conversationId}`);
        } catch (err: any) {
          console.error("❌ [Airtable Error] Détails :");
          console.error("- Message:", err.message);
          console.error("- Table/Action:", err.table || "Unknown");
          if (err.statusCode) console.error("- Statut HTTP:", err.statusCode);
          
          if (err.message && err.message.includes("Could not find table")) {
            console.error("💡 Astuce : Vérifiez vos noms de tables (Visiteurs, Conversations, Messages, Audits, Solutions suggérées).");
          }
        }
      })();
    }

    res.json({ text: aiText });
  } catch (error: any) {
    console.error("❌ Chat API Error Details:", error);
    res.status(500).json({ 
      error: "Erreur lors de la conversation IA.",
      details: error.message,
      model: "gemini-2.0-flash"
    });
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
          "Date de première visite": new Date().toISOString().split('T')[0],
          "Source": req.headers['referer'] || "Audit"
        });
        visitorRecordId = newVisitor.id;
      }

        // Create Audit
        console.log(`[Airtable] Création de l'audit pour ${visitorId}`);
        const audit = await base('Audits').create({
          "ID Audit": `audit_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          "Visiteur": [visitorRecordId],
          "Défi Majeur": auditData.challenge === 'service_client' ? 'Service Client' : 
                         auditData.challenge === 'admin' ? 'Admin' : 
                         auditData.challenge === 'data' ? 'Data' : 'Sur-Mesure',
          "Description du Problème": auditData.description,
          "Logiciels Actuels": (auditData.software || auditData.existingTools || "").substring(0, 250),
          "Volume de messages": parseInt(auditData.volume || "0"),
          "Priorité": auditData.priority === 'haute' ? 'Haute' : 
                      auditData.priority === 'moyenne' ? 'Moyenne' : 'Basse',
          "Date de soumission": new Date().toISOString().split('T')[0]
        });

        // 3. Create Suggested Solution (Table 5)
        let suggestedProduct = "";
        if (auditData.challenge === 'service_client') suggestedProduct = "Connect";
        else if (auditData.challenge === 'admin') suggestedProduct = "Process";
        else if (auditData.challenge === 'data') suggestedProduct = "Insight";
        else suggestedProduct = "Sur-Mesure";

        await base('Solutions suggérées').create({
          "ID Solution": `sol_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          "Audit": [audit.id],
          "Produit": suggestedProduct,
          "Note de pertinence": 9 
        });

        console.log(`[Airtable] ✅ Audit et Solution sauvegardés avec succès pour ${visitorId}`);
      
      // Trigger Notification
      console.log(`[Avlytext] Déclenchement alerte pour : ${auditData.company}`);
      sendNotification(
          `Nouvel Audit: ${auditData.company}`,
          `Prospect: ${auditData.name} - WhatsApp: ${auditData.whatsapp} - Défi: ${auditData.challenge}`
      );

      res.json({ success: true });
    } catch (err: any) {
      console.error("❌ [Airtable Audit Error] Détails :", {
        message: err.message,
        table: err.table
      });
      res.status(500).json({ 
        error: "Erreur lors de la sauvegarde de l'audit.",
        details: err.message 
      });
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
