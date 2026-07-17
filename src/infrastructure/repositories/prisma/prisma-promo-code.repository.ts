import { Prisma } from '@prisma/client';
import { PromoCode } from '../../../domain/entities/promo-code';
import { PostCalcRule } from '../../../domain/entities/post-calc-rule';
import { PromoRule } from '../../../domain/entities/promo-rule';
import { TierConfiguration } from '../../../domain/entities/tier-configuration';
import {
  DiscountType,
  PostCalcRuleType,
  PromoStateType,
  RuleType,
} from '../../../domain/entities/promo-code.types';
import { IPromoCodeRepository } from '../../../domain/interfaces/promo-code.repository';
import { PrismaService } from '../../prisma/prisma.service';

const promoInclude = {
  rules: { orderBy: { priority: 'asc' as const } },
  tiers: { orderBy: { orderIndex: 'asc' as const } },
};
type PromoRecord = Prisma.PromoCodeGetPayload<{ include: typeof promoInclude }>;

export class PrismaPromoCodeRepository implements IPromoCodeRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findByCode(code: string): Promise<PromoCode | null> {
    const row = await this.prisma.promoCode.findUnique({
      where: { code },
      include: promoInclude,
    });
    return row ? this.toDomain(row) : null;
  }
  async findById(id: string): Promise<PromoCode | null> {
    const row = await this.prisma.promoCode.findUnique({
      where: { id },
      include: promoInclude,
    });
    return row ? this.toDomain(row) : null;
  }
  async save(promo: PromoCode): Promise<void> {
    const dynamicRules = promo.rules.map((rule, priority) => ({
      ruleType: rule.ruleType,
      parameters: rule.parameters as Prisma.InputJsonValue,
      isActive: rule.isActive,
      priority,
    }));
    const postRules = promo.postCalcRules.map((rule, priority) => ({
      ruleType: rule.ruleType,
      parameters: rule.parameters as Prisma.InputJsonValue,
      isActive: rule.isActive,
      priority: dynamicRules.length + priority,
    }));
    await this.prisma.promoCode.upsert({
      where: { id: promo.id },
      create: {
        id: promo.id,
        code: promo.code,
        type: promo.type,
        value: promo.value,
        state: promo.state,
        startDate: promo.startDate,
        endDate: promo.endDate,
        rules: { create: [...dynamicRules, ...postRules] },
        tiers: {
          create: promo.tiers.map((tier, orderIndex) => ({
            minOrders: tier.minOrders,
            discountPercent: tier.discountPercent,
            orderIndex,
          })),
        },
      },
      update: {
        code: promo.code,
        type: promo.type,
        value: promo.value,
        state: promo.state,
        startDate: promo.startDate,
        endDate: promo.endDate,
        rules: { deleteMany: {}, create: [...dynamicRules, ...postRules] },
        tiers: {
          deleteMany: {},
          create: promo.tiers.map((tier, orderIndex) => ({
            minOrders: tier.minOrders,
            discountPercent: tier.discountPercent,
            orderIndex,
          })),
        },
      },
    });
  }
  private toDomain(row: PromoRecord): PromoCode {
    const dynamic = row.rules
      .filter((r) => Object.values(RuleType).includes(r.ruleType as RuleType))
      .map(
        (r) =>
          new PromoRule(
            r.ruleType as RuleType,
            r.parameters as Record<string, unknown>,
            r.isActive,
          ),
      );
    const post = row.rules
      .filter(
        (r) => r.ruleType === String(PostCalcRuleType.MAX_DISCOUNT_AMOUNT),
      )
      .map(
        (r) =>
          new PostCalcRule(
            PostCalcRuleType.MAX_DISCOUNT_AMOUNT,
            r.parameters as Record<string, unknown>,
            r.isActive,
          ),
      );
    return new PromoCode(
      row.id,
      row.code,
      row.type as DiscountType,
      row.value.toNumber(),
      row.state as PromoStateType,
      row.startDate,
      row.endDate,
      dynamic,
      post,
      row.tiers.map(
        (t) => new TierConfiguration(t.minOrders, t.discountPercent.toNumber()),
      ),
    );
  }
}
