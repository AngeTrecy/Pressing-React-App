import { useState, useEffect } from 'react';
import Login from './components/login'; 
import Dashboard from './components/Dashboard';
import type { User } from './db/database';
import { Toaster } from 'sonner';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className="App min-h-screen">
      <Toaster position="top-right" richColors />
      {user ? (
        <Dashboard 
          user={user} 
          onLogout={() => setUser(null)} 
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      ) : (
        <Login onLoginSuccess={(userData) => setUser(userData)} />
      )}
    </div>
  );
}

export default App;