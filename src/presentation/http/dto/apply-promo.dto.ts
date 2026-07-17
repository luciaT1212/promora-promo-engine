import { IsBoolean } from 'class-validator';
import {
  ValidatePromoRequestDto,
  ValidatePromoResponseDto,
} from './validate-promo.dto';

export class ApplyPromoRequestDto extends ValidatePromoRequestDto {
  @IsBoolean()
  isPaid!: boolean;
}

export type ApplyPromoResponseDto = ValidatePromoResponseDto;
