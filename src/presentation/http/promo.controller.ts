import {
  BadRequestException,
  Body,
  Controller,
  Post,
  HttpCode,
} from '@nestjs/common';
import {
  ValidatePromoRequestDto,
  ValidatePromoResponseDto,
} from './dto/validate-promo.dto';
import { PromoEngineProvider } from './promo-engine.provider';
import { ErrorCode } from '../../domain/errors/error-codes';
import {
  CalculatePromoRequestDto,
  CalculatePromoResponseDto,
} from './dto/calculate-promo.dto';
import {
  ApplyPromoRequestDto,
  ApplyPromoResponseDto,
} from './dto/apply-promo.dto';
import { Order } from '../../domain/entities/order';
import { BuyerProfile } from '../../domain/entities/buyer-profile';

@Controller('api/promo')
export class PromoController {
  constructor(
    readonly provider: PromoEngineProvider = new PromoEngineProvider(),
  ) {}

  @Post('validate')
  @HttpCode(200)
  async validate(
    @Body() body: ValidatePromoRequestDto,
  ): Promise<ValidatePromoResponseDto> {
    const { order, buyer } = await this.resolveOrder(body.orderId);
    const validation = await this.provider.engine.validate(
      body.code,
      order,
      buyer,
    );

    if (!validation.isValid)
      return { valid: false, errorCode: validation.firstError ?? undefined };
    return { valid: true };
  }

  @Post('calculate')
  @HttpCode(200)
  async calculate(
    @Body() body: CalculatePromoRequestDto,
  ): Promise<CalculatePromoResponseDto> {
    const { order, buyer } = await this.resolveOrder(body.orderId);
    const result = await this.provider.engine.calculate(
      body.code,
      order,
      buyer,
    );
    return this.toResponse(result);
  }

  @Post('apply')
  @HttpCode(200)
  async apply(
    @Body() body: ApplyPromoRequestDto,
  ): Promise<ApplyPromoResponseDto> {
    const { order, buyer } = await this.resolveOrder(body.orderId);
    const result = await this.provider.engine.apply(
      body.code,
      body.orderId,
      order,
      buyer,
      body.isPaid,
    );
    return this.toResponse(result);
  }

  private async resolveOrder(
    orderId: string,
  ): Promise<{ order: Order; buyer: BuyerProfile }> {
    const order = await this.provider.orderRepo.findById(orderId);
    if (!order)
      throw new BadRequestException({
        valid: false,
        errorCode: ErrorCode.INVALID_ORDER,
        message: 'No se encontró la orden solicitada.',
      });
    return { order, buyer: order.getOrderContext().buyerProfile };
  }

  private toResponse(
    result: Awaited<ReturnType<PromoEngineProvider['engine']['calculate']>>,
  ): ValidatePromoResponseDto {
    if (!result.validation.isValid) {
      return {
        valid: false,
        errorCode: result.validation.firstError ?? undefined,
      };
    }

    return {
      valid: true,
      discount: result.calculation!,
    };
  }
}
