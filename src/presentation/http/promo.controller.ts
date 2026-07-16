import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import {
  ValidatePromoRequestDto,
  ValidatePromoResponseDto,
} from './dto/validate-promo.dto';
import { PromoEngineProvider } from './promo-engine.provider';
import { BuyerProfile } from '../../domain/entities/buyer-profile';
import { OrderContext } from '../../domain/value-objects/order-context';
import { Order } from '../../domain/entities/order';

/**
 * Controller HTTP del motor. TDR seccion 8.1.
 * POST /api/promo/validate: valida el codigo + calcula descuento.
 */
@Controller('api/promo')
export class PromoController {
  private readonly provider = new PromoEngineProvider();

  @Post('validate')
  @HttpCode(200)
  async validate(
    @Body() body: ValidatePromoRequestDto,
  ): Promise<ValidatePromoResponseDto> {
    const buyer = new BuyerProfile(
      body.buyer.buyerId,
      body.buyer.totalOrders,
      body.buyer.isFirstBuyer,
    );
    const context = new OrderContext(
      buyer,
      body.categoryId,
      body.currentOrders ?? [],
    );
    const order = new Order(body.orderId, body.subtotal, context);

    const result = await this.provider.engine.validateAndCalculate(
      body.code,
      order,
      buyer,
    );

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
