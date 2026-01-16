const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Limpando banco...')
  // Limpa dados antigos para não duplicar
  await prisma.tariff.deleteMany()
  await prisma.provider.deleteMany()

  console.log('Criando Concessionárias...')
  
  // 1. Enel RJ (Luz)
  const enel = await prisma.provider.create({
    data: { name: 'Enel RJ', type: 'ELECTRICITY' }
  })
  
  // Tarifa única Enel (R$ 1.31/kWh - Exemplo)
  await prisma.tariff.create({
    data: { providerId: enel.id, minUsage: 0, rate: 1.31122, fixedFee: 0 }
  })

  // 2. Águas do Rio (Água)
  const aguas = await prisma.provider.create({
    data: { name: 'Águas do Rio', type: 'WATER' }
  })
  
  // Faixa 1: 0 a 15m³ (O valor total é 97.85, então o preço unitário é 6.5233)
  // *Nota: A água tem consumo mínimo de 15m³. O sistema calcula rate * 15.
  await prisma.tariff.create({
    data: { providerId: aguas.id, minUsage: 1, maxUsage: 15, rate: 6.52333, fixedFee: 0 }
  })

  // Faixa 2: 16 a 30m³ (Valor unitário R$ 14,35 conforme a conta)
  await prisma.tariff.create({
    data: { providerId: aguas.id, minUsage: 16, maxUsage: 30, rate: 14.35, fixedFee: 0 }
  })

  // Faixa 3: Acima de 30m³ (Estimativa, geralmente repete ou aumenta. Vamos manter 14.35 por segurança)
  await prisma.tariff.create({
    data: { providerId: aguas.id, minUsage: 31, maxUsage: null, rate: 14.35, fixedFee: 0 }
  })

  console.log('Seed realizado com sucesso!')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())