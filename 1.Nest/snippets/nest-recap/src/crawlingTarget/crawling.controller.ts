import { Controller, Get, Query } from '@nestjs/common';
import { CrawlingService } from './crawling.service';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

@Controller('crawling')
export class CrawlingContoller {
  constructor(private readonly crawlingService: CrawlingService) {}

  @Get('kin')
  async getKinHtml(@Query('page') page, @Query('svc') svc) {
    console.log(page, svc);

    return this.crawlingService.getHtmlKin({
      page,
      svc,
    });
  }

  @Get('kin-produce')
  async getKinHtmlProduce(
    @Query('start-page') startPage,
    @Query('end-page') endPage,
    @Query('svc') svc,
  ) {
    startPage = Number(startPage);
    endPage = Number(endPage);

    let total = 0;
    const size = endPage - startPage + 1;
    const iter = new Array(size).fill(0).map((_, idx) => startPage + idx);

    for await (const page of iter) {
      console.log('[info] start page', page);
      const urlList = await this.crawlingService.getHtmlKin({
        page,
        svc,
      });
      await sleep(1000);
      const successCount = await this.crawlingService.saveToCrawlingTarget(
        urlList,
        svc,
      );
      total += successCount;
      console.log(
        `[info] end page:${page} successCount:${successCount} total:${total}`,
      );
    }

    return total;
  }
}
