// ARQUIVO: src/components/EnergyCalculator.jsx
import React, { useState } from 'react';

const EnergyCalculator = () => {
  const [leituraAnterior, setLeituraAnterior] = useState('');
  const [leituraAtual, setLeituraAtual] = useState('');
  // Tarifa base ajustada conforme sua conta
  const [tarifa, setTarifa] = useState('1.31'); 
  const [cip, setCip] = useState('23.92'); 

  // VALORES DAS BANDEIRAS (R$ por kWh)
  const BANDEIRAS = {
    verde: { nome: 'Verde', taxa: 0, cor: 'text-green-600', bg: 'bg-green-50' },
    amarela: { nome: 'Amarela', taxa: 0.01885, cor: 'text-yellow-600', bg: 'bg-yellow-50' },
    vermelha1: { nome: 'Vermelha P1', taxa: 0.04463, cor: 'text-red-500', bg: 'bg-red-50' },
    vermelha2: { nome: 'Vermelha P2', taxa: 0.07877, cor: 'text-red-700', bg: 'bg-red-100' },
  };

  const calcular = () => {
    const consumo = parseFloat(leituraAtual) - parseFloat(leituraAnterior);
    const tarifaBase = parseFloat(tarifa);
    const valorCIP = parseFloat(cip);

    if (isNaN(consumo) || consumo < 0) return null;

    const cenarios = Object.keys(BANDEIRAS).map((key) => {
      const info = BANDEIRAS[key];
      const custoEnergia = consumo * tarifaBase;
      const custoBandeira = consumo * info.taxa;
      const total = custoEnergia + custoBandeira + valorCIP;
      
      return {
        ...info,
        total: total.toFixed(2),
        extra: custoBandeira.toFixed(2)
      };
    });

    return { consumo, cenarios };
  };

  const resultado = calcular();

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Simulador de Conta</h2>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Leitura Anterior</label>
            <input 
              type="number" 
              value={leituraAnterior}
              onChange={(e) => setLeituraAnterior(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
              placeholder="Ex: 67610"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Leitura Atual</label>
            <input 
              type="number" 
              value={leituraAtual}
              onChange={(e) => setLeituraAtual(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
              placeholder="Ex: 68320"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Tarifa (TE+TUSD)</label>
                  <input 
                      type="number" 
                      value={tarifa}
                      onChange={(e) => setTarifa(e.target.value)}
                      className="w-full p-3 border rounded-lg outline-none bg-gray-50"
                  />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Ilum. Púb. (CIP)</label>
                  <input 
                      type="number" 
                      value={cip}
                      onChange={(e) => setCip(e.target.value)}
                      className="w-full p-3 border rounded-lg outline-none bg-gray-50"
                  />
              </div>
          </div>
        </div>

        {resultado && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <span className="text-gray-500 text-sm uppercase tracking-wide">Consumo Apurado</span>
              <div className="text-4xl font-bold text-brand-primary">{resultado.consumo} <span className="text-xl text-gray-500">kWh</span></div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700 mb-2">Previsão por Bandeira:</h3>
              
              {resultado.cenarios.map((item) => (
                <div key={item.nome} className={`flex justify-between items-center p-3 rounded-lg ${item.bg}`}>
                  <div className="flex flex-col">
                      <span className={`font-bold ${item.cor}`}>Bandeira {item.nome}</span>
                      {item.taxa > 0 && <span className="text-xs opacity-70">Adicional: R$ {item.extra}</span>}
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    R$ {item.total}
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-gray-400 mt-4 text-center">
              *Cálculo estimado. Valores finais podem variar devido a impostos.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EnergyCalculator;