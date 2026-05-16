import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { formatPrice, formatDate } from '../utils/helpers';

export default function PaymentsView() {
  const { filteredOrders, togglePaid } = useOrders();
  const [filter, setFilter] = useState('all'); // all, paid, unpaid

  const displayOrders = filteredOrders.filter(order => {
    if (filter === 'paid') return order.isPaid;
    if (filter === 'unpaid') return !order.isPaid;
    return true;
  });

  const totalPaid = filteredOrders.filter(o => o.isPaid).reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalUnpaid = filteredOrders.filter(o => !o.isPaid).reduce((sum, o) => sum + (o.amount || 0), 0);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-[#5D4037] dark:text-[#EFEBE9] tracking-tight">Paiements</h2>
          <p className="text-[#A1887F] text-lg">Gérez vos revenus et suivez les règlements clients.</p>
        </div>
        
        <div className="flex bg-white dark:bg-[#25201D] p-1 rounded-none border border-[#D7CCC8] dark:border-[#3D3530] shadow-sm">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-none text-xs font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-[#8B5E3C] text-white shadow-lg shadow-[#8B5E3C]/20' : 'text-[#8D6E63] hover:bg-[#FAF7F5] dark:hover:bg-[#1A1614]'}`}
          >
            Tous
          </button>
          <button 
            onClick={() => setFilter('paid')}
            className={`px-6 py-2.5 rounded-none text-xs font-black uppercase tracking-widest transition-all ${filter === 'paid' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-[#8D6E63] hover:bg-[#FAF7F5] dark:hover:bg-[#1A1614]'}`}
          >
            Payés
          </button>
          <button 
            onClick={() => setFilter('unpaid')}
            className={`px-6 py-2.5 rounded-none text-xs font-black uppercase tracking-widest transition-all ${filter === 'unpaid' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-[#8D6E63] hover:bg-[#FAF7F5] dark:hover:bg-[#1A1614]'}`}
          >
            Impayés
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-[#25201D] p-8 rounded-none border border-emerald-100 dark:border-emerald-950/30 flex items-center justify-between shadow-xl shadow-emerald-500/5 group">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="w-6 h-6 rounded-none bg-emerald-100 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight size={14} />
               </div>
               <p className="text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Encaissé</p>
            </div>
            <p className="text-4xl font-black text-[#5D4037] dark:text-[#EFEBE9]">{formatPrice(totalPaid)}</p>
          </div>
          <div className="w-16 h-16 bg-emerald-600 rounded-none flex items-center justify-center text-white shadow-xl shadow-emerald-600/30 transition-transform">
            <CheckCircle size={32} />
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#25201D] p-8 rounded-none border border-orange-100 dark:border-orange-950/30 flex items-center justify-between shadow-xl shadow-orange-500/5 group">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="w-6 h-6 rounded-none bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <ArrowDownRight size={14} />
               </div>
               <p className="text-orange-700 dark:text-orange-400 text-[10px] font-black uppercase tracking-[0.2em]">Total à Percevoir</p>
            </div>
            <p className="text-4xl font-black text-[#5D4037] dark:text-[#EFEBE9]">{formatPrice(totalUnpaid)}</p>
          </div>
          <div className="w-16 h-16 bg-orange-600 rounded-none flex items-center justify-center text-white shadow-xl shadow-orange-600/30 transition-transform">
            <XCircle size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#25201D] border border-[#D7CCC8] dark:border-[#3D3530] rounded-none overflow-hidden shadow-xl shadow-[#5D4037]/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#FAF7F5] dark:bg-[#1A1614] text-[#8D6E63] text-[11px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-8 py-6">Client</th>
                <th className="px-8 py-6">Échéance</th>
                <th className="px-8 py-6">Montant</th>
                <th className="px-8 py-6 text-center">État du règlement</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFEBE9] dark:divide-[#3D3530]">
              {displayOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-[#FDFBF9] dark:hover:bg-[#2A2421] transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="font-extrabold text-[#5D4037] dark:text-[#EFEBE9] text-lg">{order.customerName}</div>
                    <div className="text-[11px] text-[#A1887F] font-bold uppercase tracking-wider">{order.phone}</div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-[#6D4C41] dark:text-[#A1887F]">{formatDate(order.dueDate)}</td>
                  <td className="px-8 py-6 font-black text-[#5D4037] dark:text-[#EFEBE9] text-xl">{formatPrice(order.amount)}</td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-5 py-2 rounded-none text-[10px] font-black inline-flex items-center gap-2 border ${order.isPaid ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900' : 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-900'}`}>
                      <div className={`w-2 h-2 rounded-none ${order.isPaid ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`} />
                      {order.isPaid ? 'RÉGLÉ' : 'EN ATTENTE'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {!order.isPaid && (
                      <button 
                        onClick={() => order.id && togglePaid(order.id, order.isPaid)}
                        className="bg-[#8B5E3C] text-white p-3 rounded-none hover:bg-[#6F4A30] transition-all shadow-md shadow-[#8B5E3C]/20"
                        title="Marquer comme payé"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
