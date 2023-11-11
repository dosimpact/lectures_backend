import { Controller, Get, Query, Res, Logger } from '@nestjs/common';
import { CrawlingService } from './crawling.service';
import { ConsumerService } from './consume.service';

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

@Controller('crawling')
export class CrawlingContoller {
  private readonly log = new Logger(CrawlingContoller.name);
  constructor(
    private readonly crawlingService: CrawlingService,
    private readonly consumeService: ConsumerService,
  ) {}

  @Get('kin')
  async getKinHtml(@Query('page') page, @Query('svc') svc) {
    console.log(page, svc);

    return this.crawlingService.getHtmlKin({
      page,
      svc,
    });
  }

  // step1. listup
  @Get('kin-produce')
  async getKinHtmlProduce(
    @Query('start-page') startPage,
    @Query('end-page') endPage,
    @Query('svc') svc,
  ) {
    // NOTE: is closed
    return;

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

  @Get('kin-crawl-content-one')
  async kinCrawlContentOne() {
    const entity = await this.crawlingService.getNextCrawlingTarget();
    console.log('-->entity', entity);

    const { title, content } = await this.crawlingService.getContentDetailPage(
      entity.url,
    );

    const savedEntity = await this.crawlingService.saveCrawlingContent(
      entity,
      title,
      content,
    );

    return savedEntity;
  }

  // step2. get detail page
  @Get('kin-crawl-content')
  async kinCrawlContent() {
    let cnt = 0;
    let errorCnt = 0;

    while (true) {
      const entity = await this.crawlingService.getNextCrawlingTarget();
      if (!entity) break;

      console.log(`[info] entity ${entity.url} start`);

      const { title, content } =
        await this.crawlingService.getContentDetailPage(entity.url);

      if (!title) {
        errorCnt += 1;
        continue;
      }

      const savedEntity = await this.crawlingService.saveCrawlingContent(
        entity,
        title,
        content,
      );
      console.log(`[info] savedEntity ${savedEntity.title} end`);
      cnt += 1;
      await sleep(1000);
    }

    return { cnt, errorCnt };
  }

  // step3. rewrite by gpt
  @Get('kin-rewrite-test')
  async kinRewrite() {
    const rewritedHTML = await this.crawlingService.rewritePostAnyOne();

    return rewritedHTML;
  }

  @Get('kin-rewrite-loop')
  async kinRewriteLoop(@Res() res) {
    let cnt = 0;
    let errorCnt = 0;

    while (true) {
      try {
        const rewritedHTML = await this.crawlingService.rewritePostAnyOne();
        if (rewritedHTML === null) break;
        cnt += 1;
        res.write(rewritedHTML);
      } catch (error) {
        console.error(error);
        errorCnt += 1;
      }
    }

    res.end({ cnt, errorCnt });
  }

  // step4. consume and output with markdown & html
  @Get('kin-consume-test')
  async kinConsumeTest(@Query('consumed-to') consumedTo) {
    try {
      await this.consumeService.consumePost(consumedTo);
      return {
        success: true,
        consumedTo,
      };
    } catch (error) {
      this.log.error('kin consume fail', error);
      return {
        success: false,
        consumedTo,
      };
    }
  }

  // crawling/kin-consume-to?consumed-to=user2
  @Get('kin-consume-to')
  async kinConsumeTo(@Query('consumed-to') consumedTo) {
    let successCnt = 0;
    let errorCnt = 0;
    const outputLen = 30;
    const iter = new Array(outputLen).fill(0).map((_, idx) => idx);

    for await (const i of iter) {
      try {
        this.log.verbose(`consume request iter ${i} consumedTo ${consumedTo}`);
        await this.consumeService.consumePost(consumedTo);
        successCnt += 1;
      } catch (error) {
        errorCnt += 1;
        this.log.error('kin consume fail', error);
      }
    }
    return {
      success: true,
      successCnt,
      errorCnt,
      consumedTo,
    };
  }

  // step -. rewrite by gpt
  @Get('kin-backfill-title-test')
  async kinBackfillTitleTest() {
    const result = await this.crawlingService.backfillTitle();

    return result;
  }

  @Get('kin-backfill-title-loop')
  async kinBackfillTitleLoop() {
    let cnt = 0;
    try {
      while (true) {
        const result = await this.crawlingService.backfillTitle();
        if (!result) break;
        cnt += 1;
      }
    } catch (error) {
      return 'Error';
    }
    return cnt;
  }
}
