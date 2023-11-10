import { Module } from '@nestjs/common';
import { CrawlingContoller } from './crawling.controller';
import { CrawlingService } from './crawling.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlingTargetEntity } from './entities/crawlingTarget.entity';
import { GptModule } from 'src/gpt-module/gpt.module';
import { GptLog } from 'src/log-module/entities/gpt-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CrawlingTargetEntity, GptLog]),
    GptModule,
  ],
  controllers: [CrawlingContoller],
  providers: [CrawlingService],
  exports: [],
})
export class CrwalingTargetModule {}
