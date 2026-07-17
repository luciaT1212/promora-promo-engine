import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromoController } from './presentation/http/promo.controller';
import { PromoEngineProvider } from './presentation/http/promo-engine.provider';

@Module({
  imports: [],
  controllers: [AppController, PromoController],
  providers: [AppService, PromoEngineProvider],
})
export class AppModule {}
