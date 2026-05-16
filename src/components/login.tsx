import React, { useState } from 'react';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react'; 
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { db, type User } from '../db/database';
// @ts-ignore
import laundryImg from '../assets/back.jpg'; 

const schema = yup.object().shape({
  email: yup.string().email('Email invalide').required('L\'email est requis'),
  password: yup.string().required('Le mot de passe est requis'),
});

type FormData = yup.InferType<typeof schema>;

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [dbError, setDbError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const user = await db.users.get(data.email);
      if (user && user.password === data.password) {
        onLoginSuccess(user); 
      } else {
        setDbError("Email ou mot de passe incorrect.");
      }
    } catch (err) {
      setDbError("Erreur de base de données.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative font-['Plus_Jakarta_Sans']" style={{ backgroundImage: `url(${laundryImg})` }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      
      {/* Conteneur Formulaire légèrement arrondi */}
      <div className="relative z-10 w-full max-w-md p-12 bg-white/10 backdrop-blur-2xl rounded-[40px] border border-white/20 shadow-2xl">
        <div className="text-center mb-10">
          {/* Logo arrondi */}
          <div className="w-20 h-20 bg-[#8B5E3C] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-[#8B5E3C]/40">
            <LogIn className="text-white" size={32} />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">IT-Pressing</h1>
          <p className="text-white/60 font-medium">Gestion professionnelle de linge</p>
        </div>
        
        {dbError && (
          <div className="mb-6 flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-bold">
            <AlertCircle size={18} />
            {dbError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#8B5E3C] transition-colors" size={20} />
              <input 
                {...register('email')}
                type="email" 
                placeholder="E-mail" 
                className={`w-full pl-14 pr-6 py-5 bg-white/5 rounded-2xl text-white outline-none border-2 ${errors.email ? 'border-red-500/50' : 'border-white/10'} focus:border-[#8B5E3C] focus:bg-white/10 transition-all font-bold placeholder:text-white/30`}
              />
            </div>
            {errors.email && <p className="ml-5 text-[10px] text-red-400 font-black uppercase tracking-wider">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#8B5E3C] transition-colors" size={20} />
              <input 
                {...register('password')}
                type="password" 
                placeholder="Mot de passe" 
                className={`w-full pl-14 pr-6 py-5 bg-white/5 rounded-2xl text-white outline-none border-2 ${errors.password ? 'border-red-500/50' : 'border-white/10'} focus:border-[#8B5E3C] focus:bg-white/10 transition-all font-bold placeholder:text-white/30`}
              />
            </div>
            {errors.password && <p className="ml-5 text-[10px] text-red-400 font-black uppercase tracking-wider">{errors.password.message}</p>}
          </div>

          {/* Bouton Se Connecter Arrondi */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-5 bg-[#8B5E3C] text-white font-black text-lg rounded-2xl shadow-2xl shadow-[#8B5E3C]/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mt-4 active:scale-95"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>SE CONNECTER</span>
                <LogIn size={22} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}