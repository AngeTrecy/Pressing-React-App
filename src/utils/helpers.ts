//  ( 2500 -> 2 500 FCFA)
export function formatPrice(amount: number | undefined): string {
    if (!amount) return '0 FCFA';
    return amount.toLocaleString('fr-FR') + ' FCFA';
}

//  "2024-05-12" -> "12 mai 2024")
export function formatDate(dateString: string | undefined): string {
    if (!dateString) return '—';
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

//  Savoir si une date est passée (pour mettre en rouge les retards)
export function isOverdue(dueDate: string | undefined): boolean {
    if (!dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
}

// 5. Des petits textes simples pour l'affichage
export const STATUS_LABELS: Record<string, string> = {
    'Pending': 'En attente',
    'In Progress': 'En cours',
    'Ready': 'Prêt',
    'Delivered': 'Livré'
};