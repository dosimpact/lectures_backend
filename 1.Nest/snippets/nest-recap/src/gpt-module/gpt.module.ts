import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GptService],
  exports: [GptService],
})
export class GptModule {}
