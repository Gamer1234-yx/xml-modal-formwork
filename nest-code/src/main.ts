import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用 WebSocket（原生 WebSocket）
const { WsAdapter } = await import('@nestjs/platform-ws');
app.useWebSocketAdapter(new WsAdapter(app));

  // 全局前缀
  app.setGlobalPrefix('api');

  // 全局参数校验管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // 自动过滤未声明字段
      transform: true,           // 自动类型转换
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 全局拦截器（统一响应格式）
  app.useGlobalInterceptors(new TransformInterceptor());

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  // 跨域
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger 文档（根据环境变量配置）
  if (process.env.SWAGGER_ENABLED === 'true') {
    const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
    const config = new DocumentBuilder()
      .setTitle(process.env.SWAGGER_TITLE || 'API Documentation')
      .setDescription(process.env.SWAGGER_DESCRIPTION || '')
      .setVersion(process.env.SWAGGER_VERSION || '1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(process.env.SWAGGER_PATH || 'api/docs', app, document);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  let logMessage = `\n🚀 服务已启动: http://localhost:${port}`;
  logMessage += `\n🔌 WebSocket:   ws://localhost:${port}`;
  if (process.env.SWAGGER_ENABLED === 'true') {
    logMessage += `\n📄 API文档:     http://localhost:${port}/${process.env.SWAGGER_PATH || 'api/docs'}`;
  }
  logMessage += '\n';
  console.log(logMessage);
}

bootstrap();