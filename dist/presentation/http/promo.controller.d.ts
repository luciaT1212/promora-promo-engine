import { ValidatePromoRequestDto, ValidatePromoResponseDto } from './dto/validate-promo.dto';
export declare class PromoController {
    private readonly provider;
    validate(body: ValidatePromoRequestDto): Promise<ValidatePromoResponseDto>;
}
