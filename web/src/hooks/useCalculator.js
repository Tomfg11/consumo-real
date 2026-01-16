import { useState, useEffect } from 'react';
import axios from 'axios';

export function useCalculator() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState('verde');
  const [extraFee, setExtraFee] = useState('');

  // Estados dos inputs
  const [readings, setReadings] = useState({
    water: { current: '', previous: '' },
    energy: { current: '', previous: '' }
  });

  // Estados dos resultados
  const [results, setResults] = useState({
    water: null,
    energy: null
  });

  // Busca provedores ao iniciar
  useEffect(() => {
    axios.get('http://localhost:3333/providers')
      .then(res => setProviders(res.data))
      .catch(err => console.error("Erro API:", err));
  }, []);

  // Função única de update dos inputs
  const handleReadingChange = (type, field, value) => {
    setReadings(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  // Função de Cálculo
  const calculate = async (type) => { // type = 'water' ou 'energy'
    const providerType = type === 'water' ? 'WATER' : 'ELECTRICITY';
    const provider = providers.find(p => p.type === providerType);
    const currentReadings = readings[type];

    if (!provider || !currentReadings.current || !currentReadings.previous) {
      alert("Preencha os campos corretamente.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3333/calculate', {
        providerId: provider.id,
        current: currentReadings.current,
        previous: currentReadings.previous,
        flag: type === 'energy' ? flag : 'verde',
        extraFee: extraFee
      });
      
      setResults(prev => ({ ...prev, [type]: response.data }));
    } catch (error) {
      alert("Erro ao calcular.");
    } finally {
      setLoading(false);
    }
  };

  return {
    readings,
    results,
    loading,
    handleReadingChange,
    calculate,
    flag,
    setFlag,
    extraFee,
    setExtraFee
  };
}