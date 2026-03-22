import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
  imports: [EnrollmentsModule],
  controllers: [WebhookController],
})
export class WebhookModule {}