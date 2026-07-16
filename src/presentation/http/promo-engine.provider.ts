import { PromoCodeEngine } from '../../application/engine/promo-code-engine';
import { ValidationEngine } from '../../application/engine/validation-engine';
import { MandatoryValidationPipeline } from '../../application/validation/pipelines/mandatory-validation.pipeline';
import { DynamicValidationPipeline } from '../../application/validation/pipelines/dynamic-validation.pipeline';
import { ValidationRuleFactory } from '../../application/factories/validation-rule.factory';
import { DiscountStrategyFactory } from '../../application/factories/discount-strategy.factory';
import { DiscountCalculator } from '../../application/calculation/discount-calculator';
import { InMemoryPromoCodeRepository } from '../../infrastructure/repositories/in-memory/in-memory-promo-code.repository';
import { InMemoryPromoCodeUsageRepository } from '../../infrastructure/repositories/in-memory/in-memory-usage.repository';
import { InMemoryRestrictedUserRepository } from '../../infrastructure/repositories/in-memory/in-memory-restricted-user.repository';
import { PromoCodeFactory } from '../../testing/factories/promo-code.factory';
import { RuleFactory } from '../../testing/factories/rule.factory';
import { TierConfiguration } from '../../domain/entities/tier-configuration';

/**
 * Composition root: instancia el motor con sus dependencias y siembra
 * algunos codigos de ejemplo para demostrar el endpoint.
 *
 * En produccion las dependencias vendrian de NestJS DI + Prisma.
 * Aca se instancian in-memory para que el examen sea autoejecutable.
 */
export class PromoEngineProvider {
  readonly promoRepo = new InMemoryPromoCodeRepository();
  readonly usageRepo = new InMemoryPromoCodeUsageRepository();
  readonly restrictedRepo = new InMemoryRestrictedUserRepository();
  readonly engine: PromoCodeEngine;

  constructor() {
    const mandatory = new MandatoryValidationPipeline(this.promoRepo);
    const ruleFactory = new ValidationRuleFactory(
      this.usageRepo,
      this.restrictedRepo,
    );
    const dynamic = new DynamicValidationPipeline(ruleFactory);
    const validationEngine = new ValidationEngine(mandatory, dynamic);
    const calculator = new DiscountCalculator(new DiscountStrategyFactory());

    this.engine = new PromoCodeEngine(validationEngine, calculator, this.usageRepo);
    this.seedExamples();
  }

  private async seedExamples(): Promise<void> {
    // SUMMER15: 15% de descuento, sin reglas
    await this.promoRepo.save(
      PromoCodeFactory.percent(15, { code: 'SUMMER15' }),
    );

    // FIRST10: 10% solo para primera compra + minimo 50
    await this.promoRepo.save(
      PromoCodeFactory.percent(10, {
        code: 'FIRST10',
        rules: [RuleFactory.firstOrderOnly(), RuleFactory.minPurchase(50)],
      }),
    );

    // FLAT20: $20 fijo
    await this.promoRepo.save(PromoCodeFactory.fixed(20, { code: 'FLAT20' }));

    // VIP: descuento por tramos segun historial
    await this.promoRepo.save(
      PromoCodeFactory.tiered(
        [
          new TierConfiguration(0, 5),
          new TierConfiguration(3, 10),
          new TierConfiguration(10, 15),
        ],
        { code: 'VIP' },
      ),
    );

    // CAPPED50: 50% pero con tope de $30
    await this.promoRepo.save(
      PromoCodeFactory.percent(50, {
        code: 'CAPPED50',
        postCalcRules: [RuleFactory.maxDiscount(30)],
      }),
    );
  }
}
