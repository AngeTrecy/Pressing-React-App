import React from 'react';
import { User, Phone, Package } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';

export default function CustomersView() {
  const { filteredOrders } = useOrders();

  // Extraire les clients uniques
  const customersMap = filteredOrders.reduce((acc, order) => {
    const key = order.customerName.toLowerCase() + order.phone;
    if (!acc[key]) {
      acc[key] = {
        name: order.customerName,
        phone: order.phone,
        orderCount: 0,
        lastOrder: order.createdAt
      };
    }
    acc[key].orderCount += 1;
    if (new Date(order.createdAt) > new Date(acc[key].lastOrder)) {
      acc[key].lastOrder = order.createdAt;
    }
    return acc;
  }, {});

  const customers = Object.values(customersMap);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-[#5D4037]">Clients</h2>
        <p className="text-[#A1887F]">Gérez les informations de vos clients fidèles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer, index) => (
          <div key={index} className="bg-white p-6 rounded-[32px] border border-[#D7CCC8] shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#8B5E3C]/10 rounded-2xl flex items-center justify-center text-[#8B5E3C]">
                <User size={24} />
              </div>
              <div className="bg-[#FAF7F5] px-3 py-1 rounded-full text-[10px] font-bold text-[#8B5E3C] uppercase tracking-wider">
                {customer.orderCount} Commande{customer.orderCount > 1 ? 's' : ''}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-[#5D4037] mb-1">{customer.name}</h3>
            
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2 text-[#8D6E63] text-sm">
                <Phone size={14} />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-[#A1887F] text-[10px] uppercase font-bold tracking-widest mt-4">
                <Package size={12} />
                <span>Dernière commande : {new Date(customer.lastOrder).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="text-center py-20 bg-white/50 rounded-[40px] border border-dashed border-[#D7CCC8]">
          <User size={48} className="mx-auto text-[#D7CCC8] mb-4" />
          <p className="text-[#A1887F] font-medium">Aucun client trouvé</p>
        </div>
      )}
    </div>
  );
}
