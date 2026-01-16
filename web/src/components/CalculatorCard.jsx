import { Droplet, Zap, Flag, Receipt } from 'lucide-react';

export function CalculatorCard({ 
  type, 
  readings, 
  onReadingChange, 
  onCalculate, 
  result, 
  loading,
  flag,
  onFlagChange,
  extraFee,
  onExtraFeeChange
}) {
  const isWater = type === 'water';
  const colorClass = isWater ? 'text-blue-600' : 'text-yellow-600';
  const Icon = isWater ? Droplet : Zap;
  const unit = isWater ? 'm³' : 'kWh';
  const title = isWater ? 'Calculadora de Água' : 'Calculadora de Luz';

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden transition-colors">
      <div className={`${isWater ? 'bg-blue-50' : 'bg-yellow-50'} p-4 rounded-full mb-4 transition`}>
        <Icon className={`w-8 h-8 ${colorClass} fill-current`} />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-6">{title}</h2>
      
      <div className="w-full space-y-4 text-left">
        
        {/* SELETOR DE BANDEIRA (Apenas para Luz) */}
        {!isWater && (
          <div className="mb-2">
             <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
               <Flag className="w-3 h-3" /> Bandeira Tarifária
             </label>
             <select 
               value={flag} 
               onChange={(e) => onFlagChange(e.target.value)}
               className="w-full mt-1 bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
             >
               <option value="verde">🟢 Bandeira Verde (Sem custo)</option>
               <option value="amarela">🟡 Bandeira Amarela (+ R$ 0,018)</option>
               <option value="vermelha1">🔴 Vermelha Patamar 1 (+ R$ 0,044)</option>
               <option value="vermelha2">🚨 Vermelha Patamar 2 (+ R$ 0,078)</option>
             </select>
          </div>
        )}
        
        {/* INPUT DE TAXAS EXTRAS (Agora aparece para Água E Luz) */}
        <div className="mb-4">
           <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
             <Receipt className="w-3 h-3" /> {isWater ? 'Taxas / Regulação (R$)' : 'CIP / Ilum. Pública (R$)'}
           </label>
           <input 
             type="number" 
             className={`w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 transition font-medium ${isWater ? 'focus:ring-blue-500' : 'focus:ring-yellow-500'}`}
             placeholder={isWater ? "Ex: 2.03" : "Ex: 23.92"}
             value={extraFee}
             onChange={(e) => onExtraFeeChange(e.target.value)}
           />
        </div>

        {['previous', 'current'].map((field) => (
          <div key={field}>
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">
              {field === 'previous' ? 'Leitura Anterior' : 'Leitura Atual'}
            </label>
            <div className="relative mt-1">
              <input 
                type="number" 
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pr-12 outline-none focus:ring-2 transition font-medium ${isWater ? 'focus:ring-blue-500' : 'focus:ring-yellow-500'}`}
                placeholder="0"
                value={readings[field]}
                onChange={(e) => onReadingChange(type, field, e.target.value)}
              />
              <span className="absolute right-4 top-3.5 text-slate-400 font-bold text-sm">{unit}</span>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onCalculate(type)}
        disabled={loading}
        className={`w-full mt-8 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 ${isWater ? 'bg-blue-600 hover:bg-blue-700' : 'bg-yellow-500 hover:bg-yellow-600'}`}
      >
        {loading ? 'Calculando...' : 'Calcular'}
      </button>

      {result && (
        <div className={`mt-4 p-4 rounded-xl w-full border animate-in fade-in slide-in-from-bottom-2 ${isWater ? 'bg-green-50 border-green-100 text-green-700' : 'bg-yellow-50 border-yellow-100 text-yellow-800'}`}>
          <span className="text-xs uppercase tracking-wider font-bold opacity-70 block mb-1">Estimativa Final</span>
          <span className="text-3xl font-bold tracking-tight">R$ {result.totalBill}</span>
          <p className="text-[10px] mt-2 opacity-60">
             *Consumo 
             {!isWater && flag !== 'verde' ? ` + Bandeira ${flag}` : ''} 
             {extraFee && parseFloat(extraFee.replace(',','.')) > 0 ? ` + Taxas (R$ ${extraFee})` : ''}
          </p>
        </div>
      )}
    </div>
  );
}