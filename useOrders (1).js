// =============================================================
//  DEV A — Flux de données, Recherche, Filtres, Moteur financier
//  Fichier : src/hooks/useOrders.js
//
//  UTILISATION dans un composant :
//    import { useOrders } from '../hooks/useOrders';
//    const { orders, unpaid, pending, todayRevenue, search, setSearch, filterStatus, setFilterStatus } = useOrders();
// =============================================================

import { useLiveQuery } from 'dexie-react-hooks';
import { useState, useMemo } from 'react';
import { db } from '../db/database';


// ─────────────────────────────────────────
//  Hook principal — tout en un
// ─────────────────────────────────────────

export function useOrders() {

  // --- États de recherche et de filtre ---
  const [search, setSearch]             = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  // filterStatus : 'all' | 'attente' | 'lavé' | 'unpaid' | 'today'

  // ── Toutes les commandes en live (se met à jour automatiquement) ──
  const allOrders = useLiveQuery(
    () => db.orders.orderBy('createdAt').reverse().toArray(),
    []
  ) ?? [];

  // ── Recherche en temps réel par nom ou téléphone ──
  const searched = useMemo(() => {
    if (!search.trim()) return allOrders;
    const q = search.toLowerCase().trim();
    return allOrders.filter(o =>
      o.customerName.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q)
    );
  }, [allOrders, search]);

  // ── Filtre par statut ──
  const orders = useMemo(() => {
    switch (filterStatus) {
      case 'attente': return searched.filter(o => o.status === 'attente');
      case 'lavé':    return searched.filter(o => o.status === 'lavé');
      case 'unpaid':  return searched.filter(o => !o.isPaid);
      case 'today':   return searched.filter(o => isToday(o.createdAt));
      default:        return searched;
    }
  }, [searched, filterStatus]);

  // ── Commandes impayées (badge sidebar) ──
  const unpaid = useMemo(
    () => allOrders.filter(o => !o.isPaid),
    [allOrders]
  );

  // ── Commandes en attente de lavage ──
  const pending = useMemo(
    () => allOrders.filter(o => o.status === 'attente'),
    [allOrders]
  );

  // ── Commandes en retard (dueDate dépassée et pas encore livrées) ──
  const overdue = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return allOrders.filter(o => o.dueDate < today && o.status === 'attente');
  }, [allOrders]);

  // ── Moteur financier : chiffre d'affaires du jour ──
  const todayRevenue = useMemo(() => {
    return allOrders
      .filter(o => o.isPaid && isToday(o.createdAt))
      .reduce((sum, o) => sum + (o.price || 0), 0);
  }, [allOrders]);

  // ── Chiffre d'affaires total (toutes commandes payées) ──
  const totalRevenue = useMemo(() => {
    return allOrders
      .filter(o => o.isPaid)
      .reduce((sum, o) => sum + (o.price || 0), 0);
  }, [allOrders]);

  // ── Montant en attente de paiement ──
  const pendingRevenue = useMemo(() => {
    return allOrders
      .filter(o => !o.isPaid)
      .reduce((sum, o) => sum + (o.price || 0), 0);
  }, [allOrders]);

  return {
    orders,           // liste filtrée + recherchée à afficher
    allOrders,        // liste brute complète
    unpaid,           // commandes impayées
    pending,          // commandes en attente de lavage
    overdue,          // commandes en retard
    todayRevenue,     // CA du jour (payés aujourd'hui)
    totalRevenue,     // CA total
    pendingRevenue,   // montant restant à encaisser
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
  };
}


// ─────────────────────────────────────────
//  Utilitaire interne
// ─────────────────────────────────────────

function isToday(date) {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate()     === today.getDate()     &&
    d.getMonth()    === today.getMonth()    &&
    d.getFullYear() === today.getFullYear()
  );
}
