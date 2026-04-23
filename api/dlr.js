
export default async function handler(req, res) {
  // Avlytext envoie généralement un POST pour les DLR
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
  }

  try {
    const dlrData = req.body;

    // Log des données reçues pour le débogage (Visible dans les logs Vercel)
    console.log("📥 [DLR Avlytext] Rapport reçu :", JSON.stringify(dlrData, null, 2));

    // Structure typique reçue d'Avlytext (à vérifier selon leur doc exacte) :
    // {
    //   "id": "message_id",
    //   "status": "delivered",
    //   "phone": "237673043127",
    //   "date": "2026-04-22 23:00:00"
    // }

    // Optionnel : Vous pourriez ici mettre à jour Airtable pour marquer le message comme "Délivré"
    // en utilisant l'ID de message renvoyé par Avlytext lors de l'envoi initial.

    // Réponse obligatoire avec un statut 200 pour confirmer la réception à Avlytext
    return res.status(200).json({ success: true, message: "DLR reçu et traité par DOULIA" });

  } catch (error) {
    console.error("❌ Erreur lors du traitement du DLR Avlytext :", error);
    return res.status(500).json({ error: "Erreur interne serveur" });
  }
}
