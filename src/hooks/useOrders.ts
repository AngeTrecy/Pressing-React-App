import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import { db, type Order } from '../db/database';

export function useOrders() {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const allOrders: Order[] = useLiveQuery(() => db.orders.toArray()) || [];

    let filteredOrders = allOrders.filter(order => {
        const searchLower = search.toLowerCase();
        const matchesSearch = (
            order.customerName.toLowerCase().includes(searchLower) ||
            order.phone.includes(searchLower)
        );
        const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const totalRevenue = allOrders.filter(o => o.isPaid).reduce((sum, o) => sum + (o.amount || 0), 0);
    const unpaidCount = allOrders.filter(o => !o.isPaid).length;

    const togglePaid = async (id: number, currentStatus: boolean) => {
        try {
            await db.orders.update(id, { isPaid: !currentStatus });
        } catch (err) {
            console.error("Erreur mise à jour paiement:", err);
        }
    };

    const deleteOrder = async (id: number) => {
        try {
            await db.orders.delete(id);
        } catch (err) {
            console.error("Erreur suppression:", err);
        }
    };

    return {
        filteredOrders,
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