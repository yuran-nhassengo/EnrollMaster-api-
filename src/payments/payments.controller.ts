import { Controller, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PayMonthlyDto } from './dto/pay-monthly.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Confirmar uma inscrição pendente
  @Patch('confirm/:id')
  confirm(@Param('id') id: string, @Req() req) {
    return this.paymentsService.confirmEnrollmentPayment(id, req.user.schoolId);
  }

  // Registrar pagamento de mensalidade manual
  @Post('monthly')
  payMonthly(@Body() dto: PayMonthlyDto, @Req() req) {
    return this.paymentsService.registerMonthlyPayment(dto, req.user.schoolId);
  }
}