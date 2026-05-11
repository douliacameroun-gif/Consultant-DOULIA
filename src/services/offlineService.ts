
import axios from 'axios';

interface PendingRequest {
  id: string;
  type: 'chat' | 'audit';
  data: any;
  timestamp: number;
}

const STORAGE_KEY = 'doulia_offline_queue';

export const offlineService = {
  // Ajouter à la file d'attente
  queueRequest(type: 'chat' | 'audit', data: any) {
    const queue: PendingRequest[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const newRequest: PendingRequest = {
      id: `${type}_${Date.now()}`,
      type,
      data,
      timestamp: Date.now()
    };
    queue.push(newRequest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    console.log(`[Offline Service] 📦 Donnée enregistrée localement (${type})`);
    return newRequest;
  },

  // Récupérer la file d'attente
  getQueue(): PendingRequest[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },

  getQueueLength(): number {
    return this.getQueue().length;
  },

  // Supprimer une requête réussie
  removeFromQueue(id: string) {
    const queue: PendingRequest[] = this.getQueue();
    const filtered = queue.filter(req => req.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  // Tenter de synchroniser
  async syncNow() {
    const queue = this.getQueue();
    if (queue.length === 0) return;

    console.log(`[Offline Service] 🔄 Tentative de synchronisation de ${queue.length} élément(s)...`);

    for (const req of queue) {
      try {
        const endpoint = req.type === 'chat' ? '/api/chat' : '/api/audit';
        await axios.post(endpoint, req.data);
        console.log(`[Offline Service] ✅ Sync réussie pour ${req.id}`);
        this.removeFromQueue(req.id);
      } catch (error) {
        console.error(`[Offline Service] ❌ Échec de sync pour ${req.id}, on réessayera plus tard.`);
        // On arrête la boucle pour ne pas flooder en cas d'erreur persistante
        break;
      }
    }
  }
};
