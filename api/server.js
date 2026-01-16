require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Rota 1: Listar Concessionárias
app.get('/providers', async (req, res) => {
  try {
    const providers = await prisma.provider.findMany();
    res.json(providers);
  } catch (error) {
    console.error("Erro ao buscar providers:", error);
    res.status(500).json({ error: "Erro interno no banco" });
  }
});

const FLAG_RATES = {
  'verde': 0,
  'amarela': 0.01892,    // R$ 1,88 a cada 100kWh
  'vermelha1': 0.044,  // R$ 4,46 a cada 100kWh
  'vermelha2': 0.078   // R$ 7,87 a cada 100kWh
};

// Rota 2: Calcular
app.post('/calculate', async (req, res) => {
  const { providerId, current, previous, flag, extraFee } = req.body;
  
  if (!providerId) return res.status(400).json({ error: "Concessionária não informada" });

  // 1. Cálculo real do consumo
  const usage = parseFloat(current) - parseFloat(previous);
  
  if (usage < 0) {
    return res.status(400).json({ error: "Leitura atual deve ser maior que a anterior" });
  }

  try {
    // 2. Buscamos quem é a concessionária para saber se é Água ou Luz
    const provider = await prisma.provider.findUnique({
      where: { id: providerId }
    });

    // 3. REGRA DO MÍNIMO: Se for Água e gastou menos de 15, cobra 15.
    let billedUsage = usage;
    if (provider && provider.type === 'WATER' && usage < 15) {
      billedUsage = 15;
    }

    const tariffs = await prisma.tariff.findMany({
      where: { providerId },
      orderBy: { minUsage: 'asc' }
    });

    const additionalCost = parseFloat(String(extraFee).replace(',', '.')) || 0;
    let totalBill = 0;
    
    // ATENÇÃO: Usamos 'billedUsage' (o faturado) para o loop, não o 'usage' real
    let remainingUsage = billedUsage; 
    
    totalBill += additionalCost;

    const flagRate = FLAG_RATES[flag] || 0;

    for (const tier of tariffs) {
      if (remainingUsage <= 0) break;
      
      // Se tier.maxUsage for null, consideramos infinito
      const tierRange = tier.maxUsage ? (tier.maxUsage - tier.minUsage + 1) : Infinity;
      
      const usageInTier = Math.min(remainingUsage, tierRange);
      
      // Soma: (Consumo da Faixa * (Preço + Bandeira)) + Taxa Fixa
      totalBill += (usageInTier * (tier.rate + flagRate)) + tier.fixedFee;
      
      remainingUsage -= usageInTier;
    }

    res.json({ usage, totalBill: totalBill.toFixed(2) });
  } catch (error) {
    console.error("Erro no cálculo:", error);
    res.status(500).json({ error: "Erro ao calcular" });
  }
});

const PORT = process.env.PORT || 3001;

// MUDANÇA: Adicionamos tratamento de erro na inicialização
const server = app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
  console.log(`📡 Aguardando requisições... (Não feche este terminal)`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`❌ A porta ${PORT} já está em uso! Tente fechar outros terminais Node.`);
  } else {
    console.error("❌ Erro no servidor:", e);
  }
});