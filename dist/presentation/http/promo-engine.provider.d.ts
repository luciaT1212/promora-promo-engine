import { PromoCodeEngine } from '../../application/engine/promo-code-engine';
import { InMemoryPromoCodeRepository } from '../../infrastructure/repositories/in-memory/in-memory-promo-code.repository';
import { InMemoryPromoCodeUsageRepository } from '../../infrastructure/repositories/in-memory/in-memory-usage.repository';
import { InMemoryRestrictedUserRepository } from '../../infrastructure/repositories/in-memory/in-memory-restricted-user.repository';
export declare class PromoEngineProvider {
    readonly promoRepo: InMemoryPromoCodeRepository;
    readonly usageRepo: InMemoryPromoCodeUsageRepository;
    readonly restrictedRepo: InMemoryRestrictedUserRepository;
    readonly engine: PromoCodeEngine;
    constructor();
    private seedExamples;
}
