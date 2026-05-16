import React, { useState } from 'react';
import { Search, Plus, Package, Clock, TrendingUp, LogOut, Trash2, Pencil, Users, LayoutDashboard, DollarSign, CheckCircle, Sun, Moon, Camera } from 'lucide-react';
import { toast } from 'sonner';
// @ts-ignore
import logo from '../assets/pressing.png';
import CustomersView from './CustomersView';
import PaymentsView from './PaymentsView';
import { useOrders } from '../hooks/useOrders'; 
import { formatPrice, formatDate, isOverdue } from '../utils/helpers';
import OrderModal from './OrderModal';
import type { User, Order } from '../db/database';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Dashboard({ user, onLogout, isDarkMode, toggleDarkMode }: DashboardProps) {
  const { filteredOrders, search, setSearch, totalRevenue, unpaidCount, deleteOrder, togglePaid } = useOrders();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [view, setView] = useState('overview'); // overview, customers, payments

  const handleOpenModal = (order: Order | null = null) => {
    setOrderToEdit(order);
    setIsModalOpen(true);
  };

  const handleTogglePaid = async (id: number, currentStatus: boolean) => {
    await togglePaid(id, currentStatus);
    toast.success(currentStatus ? "Commande marquée comme impayée" : "Commande marquée comme payée");
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer cette commande ?')) {
      await deleteOrder(id);
      toast.error("Commande supprimée");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] dark:bg-[#1A1614] text-[#5D4037] dark:text-[#EFEBE9] font-['Plus_Jakarta_Sans'] flex overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-[#25201D] border-r border-[#D7CCC8] dark:border-[#3D3530] h-screen flex flex-col p-6 z-[60] shrink-0">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-12 h-12 overflow-hidden rounded-none shadow-lg shadow-[#8B5E3C]/10">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#5D4037] dark:text-[#EFEBE9]">IT-Pressing</span>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className="p-2.5 bg-[#FAF7F5] dark:bg-[#1A1614] rounded-none text-[#8B5E3C] border border-[#D7CCC8] dark:border-[#3D3530] hover:bg-[#8B5E3C]/5 transition-all cursor-pointer"
            title="Changer de mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1">
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

        <div className="pt-6 border-t border-[#EFEBE9] dark:border-[#3D3530]">
          {/* Conservé Arrondi : Section Gérant */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-[#FAF7F5] dark:bg-[#1A1614] rounded-2xl border border-[#D7CCC8]/30 dark:border-[#3D3530]">
             <div className="w-10 h-10 bg-[#8B5E3C] rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-[#8B5E3C]/20">
               {user?.name?.[0] || 'A'}
             </div>
             <div className="flex flex-col overflow-hidden">
               <span className="text-sm font-bold truncate text-[#5D4037] dark:text-[#EFEBE9]">{user?.name || 'Admin'}</span>
               <span className="text-[10px] text-[#A1887F] uppercase tracking-widest font-black">Gérant</span>
             </div>
          </div>
          <button 
            onClick={onLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-none transition-all font-bold text-sm"
          >
            <LogOut size={20}/> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white/80 dark:bg-[#25201D]/80 backdrop-blur-md border-b border-[#D7CCC8] dark:border-[#3D3530] p-4 flex justify-between items-center sticky top-0 z-50">
          <div className="md:hidden w-10 h-10 overflow-hidden rounded-none">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="hidden md:block"></div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-[#A1887F] uppercase tracking-tighter">Aujourd'hui</p>
                <p className="text-sm font-bold text-[#5D4037] dark:text-[#EFEBE9]">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
             </div>
          </div>
        </header>

        <main className="p-8 max-w-7xl mx-auto w-full">
            {view === 'overview' && (
              <div>
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-4xl font-black text-[#5D4037] dark:text-[#EFEBE9] tracking-tight">Tableau de bord</h2>
                    <p className="text-[#A1887F] text-lg">Suivez l'activité de votre pressing en temps réel.</p>
                  </div>
                  <button 
                    onClick={() => handleOpenModal()} 
                    className="bg-[#8B5E3C] text-white px-8 py-4 rounded-none font-bold flex items-center gap-2 shadow-xl shadow-[#8B5E3C]/30 transition-all active:scale-95"
                  >
                    <Plus size={22}/> Nouvelle Commande
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <StatCard 
                    title="Chiffre d'affaires" 
                    value={formatPrice(totalRevenue)} 
                    icon={<TrendingUp className="text-white"/>} 
                    color="bg-[#8B5E3C]" 
                  />
                  <StatCard 
                    title="Impayés" 
                    value={unpaidCount.toString()} 
                    icon={<Clock className="text-white"/>} 
                    color="bg-orange-500" 
                  />
                  <StatCard 
                    title="Commandes" 
                    value={(filteredOrders?.length || 0).toString()} 
                    icon={<Package className="text-white"/>} 
                    color="bg-emerald-500" 
                  />
                </div>

                {/* Barre de recherche Carrée */}
                <div className="bg-white dark:bg-[#25201D] p-2 rounded-none border border-[#D7CCC8] dark:border-[#3D3530] mb-8 shadow-sm">
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#A1887F] w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder="Rechercher par nom ou téléphone..." 
                      value={search} 
                      onChange={e => setSearch(e.target.value)}
                      className="w-full bg-transparent px-16 py-5 rounded-none outline-none text-[#5D4037] dark:text-[#EFEBE9] text-lg font-medium placeholder:text-[#A1887F]/60"
                    />
                  </div>
                </div>

                {/* Tableau Carré */}
                <div className="bg-white dark:bg-[#25201D] border border-[#D7CCC8] dark:border-[#3D3530] rounded-none overflow-hidden shadow-xl shadow-[#5D4037]/5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[#FAF7F5] dark:bg-[#1A1614] text-[#8D6E63] text-[11px] uppercase font-black tracking-[0.15em]">
                        <tr>
                          <th className="px-8 py-6">Client & Linge</th>
                          <th className="px-8 py-6">Retrait prévu</th>
                          <th className="px-8 py-6">Montant</th>
                          <th className="px-8 py-6 text-center">Paiement</th>
                          <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EFEBE9] dark:divide-[#3D3530]">
                          {filteredOrders?.map((order) => (
                            <tr 
                              key={order.id} 
                              className="hover:bg-[#FDFBF9] dark:hover:bg-[#2A2421] transition-colors group"
                            >
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                  {order.image ? (
                                    <div className="w-12 h-12 rounded-none overflow-hidden shadow-md border border-white/20">
                                      <img src={order.image} alt="Item" className="w-full h-full object-cover" />
                                    </div>
                                  ) : (
                                    <div className="w-12 h-12 rounded-none bg-[#FAF7F5] dark:bg-[#1A1614] flex items-center justify-center text-[#A1887F] border border-dashed border-[#D7CCC8] dark:border-[#3D3530]">
                                      <Camera size={18} />
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-extrabold text-[#5D4037] dark:text-[#EFEBE9] text-lg">{order.customerName}</div>
                                    <div className="flex gap-2 items-center mt-1.5">
                                      <span className="text-[10px] text-[#8B5E3C] font-black bg-[#8B5E3C]/10 dark:bg-[#8B5E3C]/20 px-2.5 py-1 rounded-none uppercase">{order.items}</span>
                                      <span className="text-[10px] text-[#A1887F] font-bold uppercase tracking-wider">• {order.weight} kg</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-none text-sm font-bold ${isOverdue(order.dueDate) ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200' : 'bg-[#8B5E3C]/5 dark:bg-[#8B5E3C]/10 text-[#8B5E3C] dark:text-[#A1887F] border border-[#8B5E3C]/10'}`}>
                                   <Clock size={14} />
                                   {formatDate(order.dueDate)}
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="font-black text-[#5D4037] dark:text-[#EFEBE9] text-lg">{formatPrice(order.amount)}</div>
                              </td>
                              <td className="px-8 py-6 text-center">
                                <button 
                                  onClick={() => order.id && handleTogglePaid(order.id, order.isPaid)}
                                  className={`px-5 py-2 rounded-none text-[10px] font-black border transition-all ${order.isPaid ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900' : 'bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900 hover:bg-orange-100 dark:hover:bg-orange-900/30'}`}
                                >
                                  {order.isPaid ? 'PAYÉ' : 'À PAYER'}
                                </button>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleOpenModal(order)}
                                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#25201D] border border-[#D7CCC8] dark:border-[#3D3530] text-[#A1887F] hover:text-[#8B5E3C] hover:border-[#8B5E3C] rounded-none transition-all shadow-sm"
                                    title="Modifier"
                                  >
                                    <Pencil size={18} />
                                  </button>
                                  <button 
                                    onClick={() => order.id && handleDelete(order.id)}
                                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-[#25201D] border border-[#D7CCC8] dark:border-[#3D3530] text-[#A1887F] hover:text-red-500 hover:border-red-500 rounded-none transition-all shadow-sm"
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

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-none transition-all font-bold text-sm relative overflow-hidden ${
        active 
          ? 'bg-[#8B5E3C] text-white shadow-xl shadow-[#8B5E3C]/25' 
          : 'text-[#8D6E63] hover:bg-[#FAF7F5] dark:hover:bg-[#1A1614] hover:text-[#5D4037] dark:hover:text-[#EFEBE9]'
      }`}
    >
      <span className={active ? 'text-white' : 'text-inherit'}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#25201D] p-8 rounded-none border border-[#D7CCC8] dark:border-[#3D3530] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="text-3xl font-black text-[#5D4037] dark:text-[#EFEBE9] mb-1 tracking-tighter">{value}</div>
          <div className="text-[#8D6E63] text-[10px] font-black uppercase tracking-[0.2em]">{title}</div>
        </div>
        <div className={`w-14 h-14 ${color} rounded-none flex items-center justify-center shadow-lg transition-transform`}>
          {icon}
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#FAF7F5] dark:bg-[#1A1614] rounded-none blur-2xl group-hover:bg-[#8B5E3C]/5 transition-colors" />
    </div>
  );
}