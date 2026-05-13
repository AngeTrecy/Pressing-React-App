import React, { useState, useEffect } from 'react';
import { X, User, Phone, Banknote, Calendar, Scale, Shirt } from 'lucide-react';
import { db } from '../db/database';

export default function OrderModal({ isOpen, onClose, order = null }) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    price: '',
    weight: '', 
    items: '',   
    dueDate: '',
    isPaid: false
  });

  useEffect(() => {
    if (order) {
      setFormData({
        ...order,
        price: order.price.toString(),
        weight: order.weight.toString()
      });
    } else {
      setFormData({ customerName: '', phone: '', price: '', weight: '', items: '', dueDate: '', isPaid: false });
    }
  }, [order, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        ...formData,
        price: Number(formData.price),
        weight: Number(formData.weight) || 0,
        status: order?.status || 'attente',
        createdAt: order?.createdAt || new Date().toISOString()
      };

      if (order?.id) {
        await db.orders.update(order.id, orderData);
      } else {
        await db.orders.add(orderData);
      }
      // Reset et fermeture
      setFormData({ customerName: '', phone: '', price: '', weight: '', items: '', dueDate: '', isPaid: false });
      onClose();
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#5D4037]/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl border border-[#D7CCC8] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-[#5D4037]">Détails Linge</h2>
            <button onClick={onClose} className="p-2 hover:bg-[#F5F5F5] rounded-full text-[#A1887F]"><X /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input 
                required placeholder="Nom client"
                className="w-full bg-[#FAF7F5] border border-[#D7CCC8] rounded-2xl p-3 outline-none focus:border-[#8B5E3C] text-[#5D4037] placeholder:text-[#A1887F]"
                value={formData.customerName}
                onChange={e => setFormData({...formData, customerName: e.target.value})}
              />
              <input 
                required placeholder="Téléphone"
                className="w-full bg-[#FAF7F5] border border-[#D7CCC8] rounded-2xl p-3 outline-none focus:border-[#8B5E3C] text-[#5D4037] placeholder:text-[#A1887F]"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="relative">
              <Shirt className="absolute left-4 top-3 text-[#A1887F] w-5 h-5" />
              <textarea 
                required 
                placeholder="Ex: 1 robe, 3 pantalons..."
                className="w-full bg-[#FAF7F5] border border-[#D7CCC8] rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-[#8B5E3C] min-h-[80px] text-[#5D4037] placeholder:text-[#A1887F]"
                value={formData.items}
                onChange={e => setFormData({...formData, items: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1887F] w-5 h-5" />
                <input 
                  type="number" step="0.1" placeholder="Poids (kg)"
                  className="w-full bg-[#FAF7F5] border border-[#D7CCC8] rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-[#8B5E3C] text-[#5D4037] placeholder:text-[#A1887F]"
                  value={formData.weight}
                  onChange={e => setFormData({...formData, weight: e.target.value})}
                />
              </div>
              <div className="relative">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1887F] w-5 h-5" />
                <input 
                  required type="number" placeholder="Prix"
                  className="w-full bg-[#FAF7F5] border border-[#D7CCC8] rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-[#8B5E3C] text-[#5D4037] placeholder:text-[#A1887F]"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>

            <input 
              required type="date"
              className="w-full bg-[#FAF7F5] border border-[#D7CCC8] rounded-2xl p-3 outline-none focus:border-[#8B5E3C] text-[#5D4037]"
              value={formData.dueDate}
              onChange={e => setFormData({...formData, dueDate: e.target.value})}
            />

            <div className="flex items-center gap-3 p-4 bg-[#FAF7F5] rounded-2xl border border-[#D7CCC8]">
              <input 
                type="checkbox" id="paid"
                className="w-5 h-5 accent-[#8B5E3C]"
                checked={formData.isPaid}
                onChange={e => setFormData({...formData, isPaid: e.target.checked})}
              />
              <label htmlFor="paid" className="text-sm font-bold text-[#8D6E63]">Déjà payé</label>
            </div>

            <button type="submit" className="w-full bg-[#8B5E3C] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#8B5E3C]/30 transition-all active:scale-95">
              {order ? 'MODIFIER' : 'ENREGISTRER'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}