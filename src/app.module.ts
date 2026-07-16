import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromoController } from './presentation/http/promo.controller';

@Module({
  imports: [],
  controllers: [AppController, PromoController],
  providers: [AppService],
})
export class AppModule {}
