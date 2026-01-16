import { Droplet, User, Search, Menu } from 'lucide-react';
import logoImg from '../assets/Image.png';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white py-4 px-6 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
       <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <img 
            src={logoImg} 
            alt="Logo ConsumoReal" 
            className="w-8 h-8 object-contain" 
          />
          ConsumoReal
        </div>
      </div>
    </header>
  );
}