import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { WhatsappEnrollmentDto } from './dto/whatsapp-enrollment.dto';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('whatsapp')
  @HttpCode(HttpStatus.CREATED)
  async receiveWhatsappEnrollment(
    @Headers('x-api-key') apiKey: string,
    @Body() dto: WhatsappEnrollmentDto,
  ) {
    // Valida a chave de API
    const expectedKey = process.env.WHATSAPP_API_KEY ?? '';
    if (!expectedKey || apiKey !== expectedKey) {
      throw new UnauthorizedException('Chave de API inválida');
    }

    this.logger.log(
      `[Webhook] Inscrição recebida via WhatsApp: ${dto.whatsappNumber} — ${dto.name}`,
    );

    const result = await this.enrollmentsService.createFullRegistration(
      {
        name: dto.name,
        whatsappNumber: dto.whatsappNumber,
        courseId: dto.courseId,
        subjectIds: dto.subjectIds ?? [],
        paymentConfirmed: dto.paymentConfirmed ?? false,
        amountPaid: dto.amountPaid ?? 0,
      },
      dto.schoolId,
    );

    return {
      message: result.message ?? 'Inscrição criada com sucesso',
      student: {
        id: result.student.id,
        name: result.student.name,
      },
      enrollment: {
        id: result.enrollment.id,
        status: result.enrollment.status,
      },
    };
  }
}