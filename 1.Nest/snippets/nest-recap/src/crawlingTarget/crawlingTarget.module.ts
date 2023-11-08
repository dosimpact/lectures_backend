import { Module } from '@nestjs/common';
import { CrawlingContoller } from './crawling.controller';
import { CrawlingService } from './crawling.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrawlingTargetEntity } from './entities/crawlingTarget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CrawlingTargetEntity])],
  controllers: [CrawlingContoller],
  providers: [CrawlingService],
})
export class CrwalingTargetModule {}
