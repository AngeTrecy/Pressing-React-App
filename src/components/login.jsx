import React, { useState } from 'react';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react'; 
import { db } from '../db/database'; // Chemin corrigé (on remonte d'un niveau)
import laundryImg from '../assets/back.jpg'; 

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await db.users.get(email);
      if (user && user.password === password) {
        onLoginSuccess(user); 
      } else {
        setError("Email ou mot de passe incorrect.");
      }
    } catch (err) {
      setError("Erreur de base de données.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: `url(${laundryImg})` }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="relative z-10 w-full max-w-md p-10 bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/20">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Welcome back</h1>
        {error && <div className="mb-4 text-red-400 text-center text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
          <input type="email" placeholder="E-mail" onChange={e => setEmail(e.target.value)} className="w-full px-6 py-4 bg-white/10 rounded-full text-white outline-none border border-white/20" required />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} className="w-full px-6 py-4 bg-white/10 rounded-full text-white outline-none border border-white/20" required />
          <button type="submit" className="w-full py-4 bg-[#8B5E3C] text-white font-bold rounded-full hover:bg-[#6F4A30] transition-all flex items-center justify-center gap-2">
            <LogIn size={20} /> Log in
          </button>
        </form>
      </div>
    </div>
  );
}