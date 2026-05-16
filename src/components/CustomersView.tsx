import React from 'react';
import { User as UserIcon, Phone, Package, Calendar } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';

interface CustomerInfo {
  name: string;
  phone: string;
  orderCount: number;
  lastOrder: string;
}

export default function CustomersView() {
  const { filteredOrders } = useOrders();

  // Extraire les clients uniques
  const customersMap = filteredOrders.reduce((acc: Record<string, CustomerInfo>, order) => {
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
      <div className="mb-10">
        <h2 className="text-4xl font-black text-[#5D4037] dark:text-[#EFEBE9] tracking-tight">Répertoire Clients</h2>
        <p className="text-[#A1887F] text-lg">Gérez les informations et l'historique de vos clients.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {customers.map((customer, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-[#25201D] p-8 rounded-none border border-[#D7CCC8] dark:border-[#3D3530] shadow-sm hover:shadow-2xl hover:shadow-[#8B5E3C]/10 transition-all group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 bg-[#8B5E3C]/10 dark:bg-[#8B5E3C]/20 rounded-none flex items-center justify-center text-[#8B5E3C] transition-transform">
                <UserIcon size={28} />
              </div>
              <div className="bg-[#FAF7F5] dark:bg-[#1A1614] px-4 py-2 rounded-none text-[10px] font-black text-[#8B5E3C] uppercase tracking-widest border border-[#8B5E3C]/5 dark:border-[#3D3530]">
                {customer.orderCount} Commande{customer.orderCount > 1 ? 's' : ''}
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-[#5D4037] dark:text-[#EFEBE9] mb-2">{customer.name}</h3>
            
            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-3 text-[#6D4C41] dark:text-[#A1887F] font-bold">
                <div className="w-8 h-8 rounded-none bg-[#FAF7F5] dark:bg-[#1A1614] flex items-center justify-center">
                   <Phone size={16} />
                </div>
                <span>{customer.phone}</span>
              </div>
              <div className="pt-4 border-t border-[#EFEBE9] dark:border-[#3D3530] flex items-center gap-3 text-[#A1887F] text-[10px] uppercase font-black tracking-widest">
                <Calendar size={14} />
                <span>Dernière : {new Date(customer.lastOrder).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {customers.length === 0 && (
        <div className="text-center py-20 bg-white/50 dark:bg-[#25201D]/50 rounded-none border-2 border-dashed border-[#D7CCC8] dark:border-[#3D3530]">
          <div className="w-20 h-20 bg-white dark:bg-[#1A1614] rounded-none flex items-center justify-center mx-auto mb-4 text-[#D7CCC8] shadow-sm">
            <UserIcon size={32} />
          </div>
          <p className="text-xl font-bold text-[#5D4037] dark:text-[#EFEBE9]">Aucun client trouvé</p>
          <p className="text-[#A1887F]">Les clients apparaîtront ici après leur première commande.</p>
        </div>
      )}
    </div>
  );
}
