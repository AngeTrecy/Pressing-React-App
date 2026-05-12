// =============================================================
//  DEV A — Base de données IndexedDB via Dexie
//  Fichier : src/db/database.js
//
//  INSTALLATION REQUISE (à faire UNE FOIS) :
//    npm install dexie dexie-react-hooks lucide-react
//
//  UTILISATION dans un composant :
//    import { db, addOrder, updateOrder, deleteOrder, togglePayment } from '../db/database';
// =============================================================

import Dexie from 'dexie';

// ─────────────────────────────────────────
//  1. DÉFINITION DE LA BASE DE DONNÉES
// ─────────────────────────────────────────

export const db = new Dexie('PressingDB');

db.version(1).stores({
  //        clé primaire    champs indexés (pour la recherche rapide)
  orders: '++id, customerName, phone, status, isPaid, dueDate, createdAt',
});


// ─────────────────────────────────────────
//  2. CRUD — Ajouter une commande
// ─────────────────────────────────────────

/**
 * Ajoute une nouvelle commande dans IndexedDB.
 * @param {object} orderData
 * @param {string} orderData.customerName  — Nom du client
 * @param {string} orderData.phone         — Numéro de téléphone
 * @param {string} orderData.itemDetails   — Ex: "2 vestes, 1 pantalon"
 * @param {number} orderData.price         — Montant total en FCFA
 * @param {string} orderData.dueDate       — Date retrait format YYYY-MM-DD
 * @returns {Promise<number>} id de la commande créée
 */
export async function addOrder({ customerName, phone, itemDetails, price, dueDate }) {
  const id = await db.orders.add({
    customerName,
    phone,
    itemDetails,
    price,
    status:    'attente',   // valeurs possibles : 'attente' | 'lavé'
    isPaid:    false,
    dueDate,
    createdAt: new Date(),
  });
  return id;
}


// ─────────────────────────────────────────
//  3. CRUD — Mettre à jour une commande
// ─────────────────────────────────────────

/**
 * Met à jour n'importe quel champ d'une commande existante.
 * @param {number} id      — id de la commande
 * @param {object} changes — champs à modifier, ex: { status: 'lavé' }
 * @returns {Promise<number>} nombre de lignes modifiées
 */
export async function updateOrder(id, changes) {
  return await db.orders.update(id, changes);
}


// ─────────────────────────────────────────
//  4. CRUD — Supprimer une commande
// ─────────────────────────────────────────

/**
 * Supprime une commande par son id.
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function deleteOrder(id) {
  return await db.orders.delete(id);
}


// ─────────────────────────────────────────
//  5. TOGGLE — Basculer le paiement
// ─────────────────────────────────────────

/**
 * Inverse l'état de paiement d'une commande (true ↔ false).
 * @param {number} id
 * @param {boolean} currentIsPaid — valeur actuelle de isPaid
 * @returns {Promise<number>}
 */
export async function togglePayment(id, currentIsPaid) {
  return await db.orders.update(id, { isPaid: !currentIsPaid });
}


// ─────────────────────────────────────────
//  6. TOGGLE — Basculer le statut lavage
// ─────────────────────────────────────────

/**
 * Bascule le statut entre 'attente' et 'lavé'.
 * @param {number} id
 * @param {string} currentStatus — 'attente' ou 'lavé'
 * @returns {Promise<number>}
 */
export async function toggleStatus(id, currentStatus) {
  const newStatus = currentStatus === 'attente' ? 'lavé' : 'attente';
  return await db.orders.update(id, { status: newStatus });
}
