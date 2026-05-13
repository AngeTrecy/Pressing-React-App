import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { db } from '../db/database'; // Chemin corrigé

export function useOrders() {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const allOrders = useLiveQuery(() => db.orders.toArray()) || [];

    let filteredOrders = allOrders.filter(order => {
        const searchLower = search.toLowerCase();
        return (
            order.customerName.toLowerCase().includes(searchLower) ||
            order.phone.includes(searchLower)
        );
    });

    const totalRevenue = allOrders.filter(o => o.isPaid).reduce((sum, o) => sum + (o.price || 0), 0);
    const unpaidCount = allOrders.filter(o => !o.isPaid).length;

    const togglePaid = async (id, currentStatus) => {
        try {
            await db.orders.update(id, { isPaid: !currentStatus });
        } catch (err) {
            console.error("Erreur mise à jour paiement:", err);
        }
    };

    const deleteOrder = async (id) => {
        try {
            await db.orders.delete(id);
        } catch (err) {
            console.error("Erreur suppression:", err);
        }
    };

    return {
        filteredOrders, // Important: on l'appelle filteredOrders pour Dashboard
        totalRevenue,
        unpaidCount,
        search,
        setSearch,
        filterStatus,
        setFilterStatus,
        deleteOrder,
        togglePaid
    };
}