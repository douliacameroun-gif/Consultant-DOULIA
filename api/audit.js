import Airtable from "airtable";

const AIRTABLE_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;
const base = (AIRTABLE_KEY && AIRTABLE_BASE) ? new Airtable({ apiKey: AIRTABLE_KEY }).base(AIRTABLE_BASE) : null;

const AVLYTEXT_API_KEY = process.env.AVLYTEXT_API_KEY;
const AVLYTEXT_URL = process.env.AVLYTEXT_URL || 'https://api.avlytext.com/external/whatsapp/send';
const ADMIN_NUMBER = '237673043127';

async function sendNotification(title, body) {
  if (AVLYTEXT_API_KEY) {
    try {
      const payload = {
        api_key: AVLYTEXT_API_KEY,
        phone: ADMIN_NUMBER,
        text: `🔔 *ALERTE DOULIA*\n\n*${title}*\n\n${body}`
      };
      await fetch(AVLYTEXT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("❌ Avlytext Error:", err);
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { auditData, visitorId } = req.body;

  if (base) {
    try {
      // 1. Find Visitor
      const visitors = await base('Visiteurs').select({
        filterByFormula: `{ID Visiteur} = '${visitorId}'`
      }).firstPage();

      let visitorRecordId;
      if (visitors.length > 0) {
        visitorRecordId = visitors[0].id;
        await base('Visiteurs').update(visitorRecordId, {
          "Nom Prénom": auditData.name,
          "WhatsApp": auditData.whatsapp,
          "Entreprise": auditData.company
        });
      } else {
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

      // 3. Create Suggested Solution
      let suggestedProduct = "";
      if (auditData.challenge === 'service_client') suggestedProduct = "Connect";
      else if (auditData.challenge === 'admin') suggestedProduct = "Process";
      else if (auditData.challenge === 'data') suggestedProduct = "Insight";
      else suggestedProduct = "Sur-Mesure";

      await base('Solutions suggérées').create({
        "ID Solution": `sol_${Date.now()}`,
        "Audit": [audit.id],
        "Produit": suggestedProduct,
        "Note de pertinence": 9
      });
      
      // Trigger Notification
      sendNotification(
          `Nouvel Audit: ${auditData.company}`,
          `Prospect: ${auditData.name} - WhatsApp: ${auditData.whatsapp} - Défi: ${auditData.challenge}`
      );

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("❌ Airtable Audit Error Serverless:", err);
      return res.status(500).json({ error: "Erreur lors de la sauvegarde de l'audit.", details: err.message });
    }
  } else {
    return res.status(200).json({ success: true, warning: "Airtable non configuré" });
  }
}
