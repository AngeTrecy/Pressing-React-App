//  ( 2500 -> 2 500 FCFA)
export function formatPrice(amount) {
    if (!amount) return '0 FCFA';
    return amount.toLocaleString('fr-FR') + ' FCFA';
}

//  "2024-05-12" -> "12 mai 2024")
export function formatDate(dateString) {
    if (!dateString) return '—';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

//  Savoir si une date est passée (pour mettre en rouge les retards)
export function isOverdue(dueDate) {
    if (!dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
}


export function validateOrderForm(data) {

    if (!data.customerName || !data.phone || !data.price || !data.dueDate) {
        return false;
    }
    return true;
}

// 5. Des petits textes simples pour l'affichage
export const STATUS_LABELS = {
    attente: 'En attente',
    lavé: 'Lavé'
};