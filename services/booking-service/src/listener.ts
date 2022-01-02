import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.MQ_URL],
        queue: 'booking_queue',
        noAck: false,
        prefetchCount: 1,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  app.listen(() => {
    console.log('Booking service is running');
  });
}

bootstrap();
