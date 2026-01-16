import { useState } from 'react'; // Importamos o useState
import { useCalculator } from './hooks/useCalculator';
import { Header } from './components/Header';
import { CalculatorCard } from './components/CalculatorCard';
import { CheckCircle2, Timer, FileText, Droplet, Zap } from 'lucide-react';

function App() {
  // Chamamos nosso Hook de lógica
  const { readings, results, loading, handleReadingChange, calculate, flag, setFlag, extraFee, setExtraFee } = useCalculator();
  
  // NOVO: Estado para controlar qual aba está ativa (Começa na Água)
  const [activeTab, setActiveTab] = useState('water');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center pt-16 pb-12 px-4">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Calcule seu Consumo em Tempo Real
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Descubra seu uso de agua e energia com precisão.
          </p>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            *Até o momento, disponível apenas para Enel RJ e Águas do Rio.
          </p>
        </div>

        {/* --- 1. BOTÕES DE ALTERNÂNCIA (TABS) --- */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 bg-white p-2 rounded-full shadow-sm border border-slate-100">
          
          {/* Botão Água */}
          <button 
            onClick={() => setActiveTab('water')}
            className={`px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 duration-300 ${
              activeTab === 'water' 
                ? 'bg-blue-600 text-white shadow-lg scale-105' // Estilo Ativo
                : 'bg-transparent text-slate-500 hover:bg-slate-50' // Estilo Inativo
            }`}
          >
            <Droplet className={`w-5 h-5 ${activeTab === 'water' ? 'fill-current' : ''}`} /> 
            Calcular Água
          </button>

          {/* Botão Luz */}
          <button 
            onClick={() => setActiveTab('energy')}
            className={`px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 duration-300 ${
              activeTab === 'energy' 
                ? 'bg-blue-600 text-white shadow-lg scale-105' // Estilo Ativo (Pode mudar pra amarelo se quiser)
                : 'bg-transparent text-slate-500 hover:bg-slate-50' // Estilo Inativo
            }`}
          >
            <Zap className={`w-5 h-5 ${activeTab === 'energy' ? 'fill-current' : ''}`} /> 
            Calcular Luz
          </button>

        </div>

        {/* --- 2. ÁREA DOS CARDS (MOSTRA SÓ UM) --- */}
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
          
          {/* Renderização Condicional: Se tab for água, mostra card de água */}
          {activeTab === 'water' && (
            <CalculatorCard 
              type="water"
              readings={readings.water}
              result={results.water}
              loading={loading}
              onReadingChange={handleReadingChange}
              onCalculate={calculate}
              flag={flag} 
              onFlagChange={setFlag}
              extraFee={extraFee}
              onExtraFeeChange={setExtraFee}
            />
          )}

          {/* Se tab for energia, mostra card de energia */}
          {activeTab === 'energy' && (
            <CalculatorCard 
              type="energy"
              readings={readings.energy}
              result={results.energy}
              loading={loading}
              onReadingChange={handleReadingChange}
              onCalculate={calculate}
              flag={flag}
              onFlagChange={setFlag}
              extraFee={extraFee}
              onExtraFeeChange={setExtraFee}
            />
          )}

        </div>

        {/* Features Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20 max-w-4xl w-full text-center">
          <Feature icon={CheckCircle2} title="Simples" desc="Alternância rápida entre contas." />
          <Feature icon={Timer} title="Em Tempo Real" desc="Cálculo instantâneo baseado na leitura." />
          <Feature icon={FileText} title="Preciso" desc="Regras de tarifas atualizadas." />
        </div>

      </main>

      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-200 mt-auto">
        <p>© 2026 ConsumoReal. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-blue-100 p-3 rounded-xl mb-4 text-blue-600">
         <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  );
}

export default App;