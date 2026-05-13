import React, { useState } from 'react';
import { CheckCircle, XCircle, Filter, DollarSign } from 'lucide-react';
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

  const totalPaid = filteredOrders.filter(o => o.isPaid).reduce((sum, o) => sum + o.price, 0);
  const totalUnpaid = filteredOrders.filter(o => !o.isPaid).reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#5D4037]">Paiements</h2>
          <p className="text-[#A1887F]">Suivi des règlements et impayés</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-[#D7CCC8] self-start">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'all' ? 'bg-[#8B5E3C] text-white shadow-md' : 'text-[#8D6E63] hover:bg-[#FAF7F5]'}`}
          >
            Tous
          </button>
          <button 
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'paid' ? 'bg-emerald-600 text-white shadow-md' : 'text-[#8D6E63] hover:bg-[#FAF7F5]'}`}
          >
            Payés
          </button>
          <button 
            onClick={() => setFilter('unpaid')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'unpaid' ? 'bg-orange-600 text-white shadow-md' : 'text-[#8D6E63] hover:bg-[#FAF7F5]'}`}
          >
            Impayés
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 flex items-center justify-between">
          <div>
            <p className="text-emerald-700 text-xs font-black uppercase tracking-widest mb-1">Total Encaissé</p>
            <p className="text-3xl font-black text-emerald-900">{formatPrice(totalPaid)}</p>
          </div>
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <CheckCircle size={28} />
          </div>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-[32px] border border-orange-100 flex items-center justify-between">
          <div>
            <p className="text-orange-700 text-xs font-black uppercase tracking-widest mb-1">Total à Percevoir</p>
            <p className="text-3xl font-black text-orange-900">{formatPrice(totalUnpaid)}</p>
          </div>
          <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
            <XCircle size={28} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#D7CCC8] rounded-[40px] overflow-hidden shadow-md">
        <table className="w-full text-left">
          <thead className="bg-[#F5F5F5] text-[#8D6E63] text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="p-6">Client</th>
              <th className="p-6">Date Échéance</th>
              <th className="p-6">Montant</th>
              <th className="p-6 text-center">État</th>
              <th className="p-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFEBE9]">
            {displayOrders.map(order => (
              <tr key={order.id} className="hover:bg-[#FDFBF9] transition-colors">
                <td className="p-6">
                  <div className="font-bold text-[#5D4037]">{order.customerName}</div>
                  <div className="text-[10px] text-[#A1887F] font-medium">{order.phone}</div>
                </td>
                <td className="p-6 text-sm text-[#6D4C41]">{formatDate(order.dueDate)}</td>
                <td className="p-6 font-black text-[#5D4037]">{formatPrice(order.price)}</td>
                <td className="p-6 text-center">
                  <span className={`px-4 py-2 rounded-full text-[10px] font-black inline-flex items-center gap-2 ${order.isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${order.isPaid ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                    {order.isPaid ? 'RÉGLÉ' : 'EN ATTENTE'}
                  </span>
                </td>
                <td className="p-6 text-center">
                  {!order.isPaid && (
                    <button 
                      onClick={() => { if(window.confirm('Marquer comme payé ?')) togglePaid(order.id, order.isPaid) }}
                      className="text-emerald-500 hover:bg-emerald-50 p-2 rounded-full transition-colors"
                      title="Marquer comme payé"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayOrders.length === 0 && (
          <div className="p-20 text-center text-[#A1887F] font-medium">
            Aucune commande correspondante
          </div>
        )}
      </div>
    </div>
  );
}
