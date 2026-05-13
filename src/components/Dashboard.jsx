import React, { useState } from 'react';
import { Search, Plus, Package, Clock, TrendingUp, LogOut, Trash2, Pencil, Users, LayoutDashboard, DollarSign, CheckCircle } from 'lucide-react';
import logo from '../assets/pressing.png';
import CustomersView from './CustomersView';
import PaymentsView from './PaymentsView';
import { useOrders } from '../hooks/useOrders'; 
import { formatPrice, formatDate, isOverdue } from '../utils/helpers';
import OrderModal from './OrderModal';

export default function Dashboard({ user, onLogout }) {
  const { filteredOrders, search, setSearch, totalRevenue, unpaidCount, deleteOrder, togglePaid } = useOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [view, setView] = useState('overview'); // overview, customers, payments

  const handleOpenModal = (order = null) => {
    setOrderToEdit(order);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#5D4037] font-['Plus_Jakarta_Sans'] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-[#D7CCC8] sticky top-0 h-screen flex flex-col p-6 z-[60]">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 overflow-hidden rounded-xl">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[#8B5E3C]">IT-Pressing</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Tableau de bord" 
            active={view === 'overview'} 
            onClick={() => setView('overview')} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Clients" 
            active={view === 'customers'} 
            onClick={() => setView('customers')} 
          />
          <NavItem 
            icon={<DollarSign size={20} />} 
            label="Paiements" 
            active={view === 'payments'} 
            onClick={() => setView('payments')} 
          />
        </nav>

        <div className="pt-6 border-t border-[#EFEBE9]">
          <div className="flex items-center gap-3 mb-6 p-2">
             <div className="w-10 h-10 bg-[#8B5E3C]/10 rounded-full flex items-center justify-center text-[#8B5E3C] font-bold">
               {user?.name?.[0] || 'A'}
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-bold truncate w-32">{user?.name || 'Admin'}</span>
               <span className="text-[10px] text-[#A1887F] uppercase tracking-widest font-bold">Gérant</span>
             </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm">
            <LogOut size={20}/> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white/80 backdrop-blur-md border-b border-[#D7CCC8] p-4 flex justify-end items-center sticky top-0 z-50 md:hidden">
          <div className="w-10 h-10 overflow-hidden rounded-lg">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </header>

        <main className="p-8 max-w-6xl mx-auto w-full">
          {view === 'overview' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-[#5D4037]">Tableau de bord</h2>
                <p className="text-[#A1887F]">Bienvenue sur votre espace de gestion Pressing</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Chiffre d'affaires" value={formatPrice(totalRevenue)} icon={<TrendingUp className="text-[#8B5E3C]"/>} color="bg-[#8B5E3C]/10" />
                <StatCard title="Impayés" value={unpaidCount} icon={<Clock className="text-[#8B5E3C]"/>} color="bg-[#8B5E3C]/10" />
                <StatCard title="Total Commandes" value={filteredOrders?.length || 0} icon={<Package className="text-[#8B5E3C]"/>} color="bg-[#8B5E3C]/10" />
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1887F] w-5 h-5" />
                  <input 
                    type="text" placeholder="Rechercher une commande..." value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white border border-[#D7CCC8] px-12 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-[#8B5E3C]/20 text-[#5D4037] placeholder:text-[#A1887F]"
                  />
                </div>
                <button onClick={() => handleOpenModal()} className="bg-[#8B5E3C] text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-[#8B5E3C]/20 transition-transform active:scale-95">
                  <Plus size={20}/> Nouvelle Commande
                </button>
              </div>

              <div className="bg-white border border-[#D7CCC8] rounded-[40px] overflow-hidden shadow-md">
                <table className="w-full text-left">
                  <thead className="bg-[#F5F5F5] text-[#8D6E63] text-xs uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-6">Client & Linge</th>
                      <th className="p-6">Retrait</th>
                      <th className="p-6">Prix</th>
                      <th className="p-6 text-center">Statut</th>
                      <th className="p-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFEBE9]">
                    {filteredOrders?.map(order => (
                      <tr key={order.id} className="hover:bg-[#FDFBF9] transition-colors">
                        <td className="p-6">
                          <div className="font-bold text-[#5D4037]">{order.customerName}</div>
                          <div className="flex gap-2 items-center mt-1">
                            <span className="text-[10px] text-[#8B5E3C] font-bold bg-[#8B5E3C]/10 px-2 py-0.5 rounded uppercase">{order.items}</span>
                            <span className="text-[10px] text-[#A1887F] font-medium">• {order.weight} kg</span>
                          </div>
                        </td>
                        <td className={`p-6 text-sm ${isOverdue(order.dueDate) ? 'text-red-500 font-bold' : 'text-[#6D4C41]'}`}>{formatDate(order.dueDate)}</td>
                        <td className="p-6 font-semibold text-[#5D4037]">{formatPrice(order.price)}</td>
                        <td className="p-6 text-center">
                          <span className={`px-4 py-2 rounded-full text-[10px] font-black ${order.isPaid ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                            {order.isPaid ? 'PAYÉ' : 'À PAYER'}
                          </span>
                        </td>
                        <td className="p-6 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {!order.isPaid && (
                              <>
                                <button 
                                  onClick={() => { if(window.confirm('Marquer comme payé ?')) togglePaid(order.id, order.isPaid) }}
                                  className="text-emerald-500 hover:bg-emerald-50 p-2 rounded-full transition-colors"
                                  title="Marquer comme payé"
                                >
                                  <CheckCircle size={18} />
                                </button>
                                <button 
                                  onClick={() => handleOpenModal(order)}
                                  className="text-[#A1887F] hover:text-[#8B5E3C] p-2 rounded-full transition-colors"
                                  title="Modifier"
                                >
                                  <Pencil size={18} />
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => { if(window.confirm('Supprimer cette commande ?')) deleteOrder(order.id) }}
                              className="text-[#A1887F] hover:text-red-500 p-2 rounded-full transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === 'customers' && <CustomersView />}
          {view === 'payments' && <PaymentsView />}
        </main>
      </div>

      <OrderModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setOrderToEdit(null); }} 
        order={orderToEdit}
      />
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${
        active 
          ? 'bg-[#8B5E3C] text-white shadow-lg shadow-[#8B5E3C]/20' 
          : 'text-[#8D6E63] hover:bg-[#FAF7F5]'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-[#D7CCC8] shadow-sm hover:shadow-md transition-all group">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>{icon}</div>
      <div className="text-2xl font-black text-[#5D4037]">{value}</div>
      <div className="text-[#8D6E63] text-xs font-bold uppercase tracking-wider">{title}</div>
    </div>
  );
}