import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString)
  throw new Error('DATABASE_URL es obligatoria para sembrar PostgreSQL');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const ids = {
  buyer: '10000000-0000-4000-8000-000000000001',
  category: '20000000-0000-4000-8000-000000000001',
  childCategory: '20000000-0000-4000-8000-000000000002',
  fixedPromo: '30000000-0000-4000-8000-000000000001',
  percentPromo: '30000000-0000-4000-8000-000000000002',
  tieredPromo: '30000000-0000-4000-8000-000000000003',
  fixedOrder: '40000000-0000-4000-8000-000000000001',
  percentOrder: '40000000-0000-4000-8000-000000000002',
  tieredOrder: '40000000-0000-4000-8000-000000000003',
};

async function seedPromo(
  id: string,
  code: string,
  type: 'fixed' | 'percent' | 'tiered',
  value: number,
): Promise<void> {
  await prisma.promoCode.upsert({
    where: { id },
    create: {
      id,
      code,
      type,
      value,
      state: 'active',
      startDate: new Date('2020-01-01T00:00:00.000Z'),
      endDate: new Date('2099-12-31T23:59:59.999Z'),
    },
    update: {
      code,
      type,
      value,
      state: 'active',
      startDate: new Date('2020-01-01T00:00:00.000Z'),
      endDate: new Date('2099-12-31T23:59:59.999Z'),
    },
  });
}

async function main(): Promise<void> {
  await prisma.category.upsert({
    where: { id: ids.category },
    create: { id: ids.category, name: 'Tecnología' },
    update: { name: 'Tecnología' },
  });
  await prisma.category.upsert({
    where: { id: ids.childCategory },
    create: {
      id: ids.childCategory,
      name: 'Teléfonos',
      parentId: ids.category,
    },
    update: { name: 'Teléfonos', parentId: ids.category },
  });
  await prisma.buyerProfile.upsert({
    where: { id: ids.buyer },
    create: { id: ids.buyer, totalOrders: 7, isFirstBuyer: false },
    update: { totalOrders: 7, isFirstBuyer: false },
  });

  const orders = [
    { id: ids.fixedOrder, subtotal: 80, type: 'product' as const },
    { id: ids.percentOrder, subtotal: 200, type: 'service' as const },
    { id: ids.tieredOrder, subtotal: 150, type: 'subscription' as const },
  ];
  for (const order of orders) {
    await prisma.order.upsert({
      where: { id: order.id },
      create: {
        ...order,
        buyerId: ids.buyer,
        categoryId: ids.childCategory,
        status: 'pending',
      },
      update: {
        subtotal: order.subtotal,
        buyerId: ids.buyer,
        categoryId: ids.childCategory,
        status: 'pending',
        type: order.type,
      },
    });
  }

  await seedPromo(ids.fixedPromo, 'DB-FIXED20', 'fixed', 20);
  await seedPromo(ids.percentPromo, 'DB-PERCENT15', 'percent', 15);
  await seedPromo(ids.tieredPromo, 'DB-TIERED', 'tiered', 0);

  await prisma.promoRule.deleteMany({
    where: {
      promoCodeId: { in: [ids.fixedPromo, ids.percentPromo, ids.tieredPromo] },
    },
  });
  await prisma.promoRule.createMany({
    data: [
      {
        promoCodeId: ids.fixedPromo,
        ruleType: 'eligible_categories',
        parameters: { categoryIds: [ids.category] },
        priority: 0,
      },
      {
        promoCodeId: ids.percentPromo,
        ruleType: 'min_purchase_amount',
        parameters: { minAmount: 100 },
        priority: 0,
      },
      {
        promoCodeId: ids.percentPromo,
        ruleType: 'restricted_usage',
        parameters: {},
        priority: 1,
      },
    ],
  });

  await prisma.tierConfiguration.deleteMany({
    where: { promoCodeId: ids.tieredPromo },
  });
  await prisma.tierConfiguration.createMany({
    data: [
      {
        promoCodeId: ids.tieredPromo,
        minOrders: 10,
        discountPercent: 20,
        orderIndex: 0,
      },
      {
        promoCodeId: ids.tieredPromo,
        minOrders: 0,
        discountPercent: 5,
        orderIndex: 1,
      },
      {
        promoCodeId: ids.tieredPromo,
        minOrders: 3,
        discountPercent: 10,
        orderIndex: 2,
      },
    ],
  });
  await prisma.restrictedUserMapping.upsert({
    where: {
      promoCodeId_buyerId: {
        promoCodeId: ids.percentPromo,
        buyerId: ids.buyer,
      },
    },
    create: { promoCodeId: ids.percentPromo, buyerId: ids.buyer },
    update: {},
  });

  console.log('Seed PostgreSQL completado de forma idempotente.');
}

main()
  .catch((error: unknown) => {
    console.error('No se pudo completar el seed de PostgreSQL.', error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
