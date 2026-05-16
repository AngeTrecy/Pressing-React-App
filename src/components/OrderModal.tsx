import React, { useEffect, useState } from 'react';
import { X, Shirt, Scale, Banknote, Calendar, Phone, User, Camera, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { db, type Order } from '../db/database';

const schema = yup.object().shape({
  customerName: yup.string().required('Le nom est requis'),
  phone: yup.string().required('Le téléphone est requis'),
  items: yup.string().required('La description du linge est requise'),
  weight: yup.number().transform((value) => (isNaN(value) ? 0 : value)).default(0),
  amount: yup.number().typeError('Le prix doit être un nombre').positive('Le prix doit être positif').required('Le prix est requis'),
  dueDate: yup.string().required('La date de livraison est requise'),
  isPaid: yup.boolean().default(false),
  image: yup.string().optional(),
});

type FormData = yup.InferType<typeof schema>;

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order | null;
}

export default function OrderModal({ isOpen, onClose, order = null }: OrderModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      customerName: '',
      phone: '',
      items: '',
      weight: 0,
      amount: 0,
      dueDate: '',
      isPaid: false,
      image: '',
    }
  });

  useEffect(() => {
    if (order && isOpen) {
      reset({
        customerName: order.customerName,
        phone: order.phone,
        items: order.items,
        weight: order.weight,
        amount: order.amount,
        dueDate: order.dueDate,
        isPaid: order.isPaid,
        image: order.image || '',
      });
      setImagePreview(order.image || null);
    } else if (isOpen) {
      reset({
        customerName: '',
        phone: '',
        items: '',
        weight: 0,
        amount: 0,
        dueDate: '',
        isPaid: false,
        image: '',
      });
      setImagePreview(null);
    }
  }, [order, isOpen, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setValue('image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const orderData: Order = {
        ...data,
        status: order?.status || 'Pending',
        createdAt: order?.createdAt || new Date().toISOString(),
      };

      if (order?.id) {
        await db.orders.update(order.id, orderData);
        toast.success("Commande mise à jour");
      } else {
        await db.orders.add(orderData);
        toast.success("Nouvelle commande enregistrée");
      }
      onClose();
    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#5D4037]/60 dark:bg-black/80 backdrop-blur-md"
      />
      
      {/* Modal Carrée pour correspondre au Dashboard */}
      <div className="bg-white dark:bg-[#25201D] w-full max-w-2xl rounded-none shadow-2xl border border-[#D7CCC8] dark:border-[#3D3530] overflow-hidden relative z-10 max-h-[90vh] overflow-y-auto">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-[#5D4037] dark:text-[#EFEBE9] tracking-tight">
                {order ? 'Modifier la commande' : 'Nouvelle commande'}
              </h2>
              <p className="text-[#A1887F] font-medium text-sm mt-1">Capturez l'état du linge à la réception.</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 hover:bg-[#FAF7F5] dark:hover:bg-[#1A1614] rounded-none text-[#A1887F] transition-colors border border-[#D7CCC8]/30 dark:border-[#3D3530]"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left: Image Upload */}
              <div className="w-full md:w-1/3">
                <div className="space-y-1.5 h-full">
                  <label className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest ml-4">Photo de l'article</label>
                  <div className="relative group aspect-square">
                    <div className={`w-full h-full rounded-none overflow-hidden border-2 border-dashed ${imagePreview ? 'border-solid border-[#8B5E3C]' : 'border-[#D7CCC8] dark:border-[#3D3530]'} bg-[#FAF7F5] dark:bg-[#1A1614] flex flex-col items-center justify-center transition-all group-hover:border-[#8B5E3C]`}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-4">
                          <Camera className="mx-auto text-[#A1887F] mb-2" size={32} />
                          <p className="text-[10px] font-bold text-[#A1887F] uppercase tracking-wider">Prendre une photo</p>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#8B5E3C] rounded-none flex items-center justify-center text-white shadow-lg shadow-[#8B5E3C]/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Form Fields */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest ml-4">Client</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1887F] w-5 h-5" />
                      <input 
                        {...register('customerName')}
                        placeholder="Nom complet"
                        className="w-full bg-[#FAF7F5] dark:bg-[#1A1614] border-2 border-transparent dark:border-[#3D3530] rounded-none py-3 pl-12 pr-4 outline-none focus:border-[#8B5E3C] text-[#5D4037] dark:text-[#EFEBE9] font-bold transition-all"
                      />
                    </div>
                    {errors.customerName && <p className="mt-1 ml-4 text-[10px] text-red-500 font-bold">{errors.customerName.message}</p>}
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest ml-4">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1887F] w-5 h-5" />
                      <input 
                        {...register('phone')}
                        placeholder="Numéro"
                        className="w-full bg-[#FAF7F5] dark:bg-[#1A1614] border-2 border-transparent dark:border-[#3D3530] rounded-none py-3 pl-12 pr-4 outline-none focus:border-[#8B5E3C] text-[#5D4037] dark:text-[#EFEBE9] font-bold transition-all"
                      />
                    </div>
                    {errors.phone && <p className="mt-1 ml-4 text-[10px] text-red-500 font-bold">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest ml-4">Description</label>
                  <div className="relative">
                    <Shirt className="absolute left-4 top-4 text-[#A1887F] w-5 h-5" />
                    <textarea 
                      {...register('items')}
                      placeholder="Ex: 2 Chemises, 1 Veste..."
                      className="w-full bg-[#FAF7F5] dark:bg-[#1A1614] border-2 border-transparent dark:border-[#3D3530] rounded-none py-4 pl-12 pr-6 outline-none focus:border-[#8B5E3C] min-h-[80px] text-[#5D4037] dark:text-[#EFEBE9] font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest ml-4">Prix (FCFA)</label>
                    <div className="relative">
                      <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1887F] w-5 h-5" />
                      <input 
                        {...register('amount')}
                        type="number"
                        className="w-full bg-[#FAF7F5] dark:bg-[#1A1614] border-2 border-transparent dark:border-[#3D3530] rounded-none py-3 pl-12 pr-4 outline-none focus:border-[#8B5E3C] text-[#5D4037] dark:text-[#EFEBE9] font-bold transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest ml-4">Livraison</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1887F] w-5 h-5" />
                      <input 
                        {...register('dueDate')}
                        type="date"
                        className="w-full bg-[#FAF7F5] dark:bg-[#1A1614] border-2 border-transparent dark:border-[#3D3530] rounded-none py-3 pl-12 pr-4 outline-none focus:border-[#8B5E3C] text-[#5D4037] dark:text-[#EFEBE9] font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex-1 flex items-center gap-4 p-5 bg-[#FAF7F5] dark:bg-[#1A1614] rounded-none border border-[#D7CCC8] dark:border-[#3D3530] hover:border-[#8B5E3C]/20 transition-all cursor-pointer">
                <input 
                  {...register('isPaid')}
                  type="checkbox" id="paid"
                  className="w-6 h-6 accent-[#8B5E3C] rounded-none"
                />
                <label htmlFor="paid" className="text-sm font-extrabold text-[#5D4037] dark:text-[#EFEBE9] cursor-pointer uppercase tracking-tight">Déjà payé</label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-[2] bg-[#8B5E3C] text-white py-5 rounded-none font-black text-lg shadow-xl shadow-[#8B5E3C]/30 transition-all disabled:opacity-50 active:scale-95"
              >
                {isSubmitting ? 'Traitement...' : order ? 'METTRE À JOUR' : 'ENREGISTRER'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}