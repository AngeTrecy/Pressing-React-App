// =============================================================
//  DEV A — Utilitaires partagés
//  Fichier : src/utils/helpers.js
//
//  Fonctions utilitaires utilisées par Dev A ET Dev B
// =============================================================


// ─────────────────────────────────────────
//  Formatage monétaire (FCFA)
// ─────────────────────────────────────────

/**
 * Formate un nombre en prix FCFA.
 * @param {number} amount
 * @returns {string}  ex: "15 000 FCFA"
 */
export function formatPrice(amount) {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}


// ─────────────────────────────────────────
//  Formatage des dates
// ─────────────────────────────────────────

/**
 * Formate une date en français lisible.
 * @param {Date|string} date
 * @returns {string}  ex: "lun. 12 mai 2025"
 */
export function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day:     '2-digit',
    month:   'short',
    year:    'numeric',
  });
}

/**
 * Retourne true si la date est dépassée (retard).
 * @param {string} dueDate — format YYYY-MM-DD
 * @returns {boolean}
 */
export function isOverdue(dueDate) {
  if (!dueDate) return false;
  const today = new Date().toISOString().split('T')[0];
  return dueDate < today;
}

/**
 * Retourne le nombre de jours restants avant la date de retrait.
 * Négatif si en retard.
 * @param {string} dueDate — format YYYY-MM-DD
 * @returns {number}
 */
export function daysUntilDue(dueDate) {
  if (!dueDate) return null;
  const now  = new Date();
  const due  = new Date(dueDate);
  const diff = Math.round((due - now) / (1000 * 60 * 60 * 24));
  return diff;
}


// ─────────────────────────────────────────
//  Validation du formulaire (pour Dev B)
// ─────────────────────────────────────────

/**
 * Valide les données du formulaire avant addOrder().
 * @param {object} formData
 * @returns {{ valid: boolean, errors: object }}
 */
export function validateOrderForm(formData) {
  const errors = {};

  if (!formData.customerName?.trim()) {
    errors.customerName = 'Le nom du client est requis.';
  }

  if (!formData.phone?.trim()) {
    errors.phone = 'Le numéro de téléphone est requis.';
  } else if (!/^\d{8,15}$/.test(formData.phone.replace(/\s/g, ''))) {
    errors.phone = 'Numéro invalide (8 à 15 chiffres).';
  }

  if (!formData.itemDetails?.trim()) {
    errors.itemDetails = 'Décrivez les vêtements déposés.';
  }

  if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
    errors.price = 'Le montant doit être un nombre positif.';
  }

  if (!formData.dueDate) {
    errors.dueDate = 'La date de retrait est requise.';
  } else {
    const today = new Date().toISOString().split('T')[0];
    if (formData.dueDate < today) {
      errors.dueDate = 'La date de retrait ne peut pas être dans le passé.';
    }
  }

  return {
    valid:  Object.keys(errors).length === 0,
    errors,
  };
}


// ─────────────────────────────────────────
//  Labels lisibles pour les statuts
// ─────────────────────────────────────────

export const STATUS_LABELS = {
  attente: 'En attente',
  lavé:    'Lavé ✓',
};

export const PAYMENT_LABELS = {
  true:  'Payé',
  false: 'Impayé',
};
