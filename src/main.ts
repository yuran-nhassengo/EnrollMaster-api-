import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // URL do seu Next.js
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permitir cookies/headers de autorização se necessário
  });

  await app.listen(process.env.PORT ?? 3001);
  console.log('Backend rodando em: http://localhost:3001');
}
bootstrap();
