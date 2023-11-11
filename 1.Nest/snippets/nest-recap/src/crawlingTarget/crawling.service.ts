import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CrawlingTargetEntity } from './entities/crawlingTarget.entity';
import { Repository, Not, IsNull } from 'typeorm';
import * as pretty from 'pretty';
import { Inject, Injectable } from '@nestjs/common';
import { GptService } from 'src/gpt-module/gpt.service';
import * as showdown from 'showdown';
import { GptLog } from 'src/log-module/entities/gpt-log.entity';

const kinHost = 'https://kin.naver.com';
const getKinUrlTemplate = ({ page, svc }) =>
  `https://kin.naver.com/best/listaha.naver?svc=${svc}&page=${page}`;

@Injectable()
export class CrawlingService {
  constructor(
    @InjectRepository(CrawlingTargetEntity)
    private readonly CrawlingTargetRepo: Repository<CrawlingTargetEntity>,
    @InjectRepository(GptLog)
    private readonly gptLogRepo: Repository<GptLog>,
    @Inject(GptService)
    private readonly gptService: GptService,
  ) {}

  async getHtmlKin({ page, svc }) {
    const response = await axios.get(getKinUrlTemplate({ page, svc }), {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // with class  ( > 먹히지 않는다. )
    const aTagList = $('#au_board_list tr td.title a')
      .map((_, el) => {
        console.log('[info] title', $(el).html());
        return $(el).attr('href');
      })
      .toArray();

    return aTagList.map((tag) => kinHost + tag);
  }

  async saveToCrawlingTarget(urlList: string[], svc: string) {
    urlList.forEach((url) => {
      const params = new URLSearchParams(new URL(url).search);
      // 쿼리 파라미터 가져오기
      const dirId = params.get('dirId');
      const docId = params.get('docId');

      const entity = this.CrawlingTargetRepo.create({
        docId: Number(docId),
        dirId,
        url,
        svc,
      });
      this.CrawlingTargetRepo.save(entity);
    });

    return urlList.length;
  }

  // get next target
  async getNextCrawlingTarget() {
    const entity = await this.CrawlingTargetRepo.findOne({
      where: {
        contentHTML: '',
        title: Not(''),
        // isCrawled: false,
        // id: 1, // debug
      },
      order: {
        id: 'ASC',
      },
    });

    return entity;
  }

  // get html and parsing and resave
  async getContentDetailPage(url: string) {
    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      const html = response.data;
      const $ = cheerio.load(html);

      const title = $('div.title').text().trim();

      // parser - img to [첨부이미지]
      const imgList = $('div.end_content')
        .find('span[data-image-id]')
        .replaceWith('<div>[첨부이미지]</div>');

      // parser - table remove
      $('div.end_content').find('table.txc-table').replaceWith('<div></div>');

      console.log('>>html', pretty($('div.end_content').html().trim()));
      console.log('>>content', pretty($('div.end_content').text().trim()));

      return {
        title,
        content: pretty($('div.end_content').text().trim()),
        imgLen: imgList.length,
      };
    } catch (error) {
      return {};
    }
  }

  async saveCrawlingContent(
    entity: CrawlingTargetEntity,
    title: string,
    content: string,
  ) {
    entity.isCrawled = true;
    entity.title = title;
    entity.contentHTML = content;

    return await this.CrawlingTargetRepo.save(entity);
  }

  async rewritableEntity() {
    const entity = await this.CrawlingTargetRepo.findOne({
      where: {
        // contentHTML: Not(null),
        isRewrited: false,
        isError: false,
      },
      order: {
        id: 'ASC',
      },
    });
    return entity;
  }

  async rewriteGpt(originalPost: string) {
    const result = await this.gptService.rewriteGpt(originalPost);
    return result;
  }

  async rewriteSaveResult(
    entity: CrawlingTargetEntity,
    rewritedMarkdown: string,
    rewritedHTML: string,
    originalPrompot: string,
    translatedTitle: string,
  ) {
    entity.isRewrited = true;
    entity.rewritedMarkdown = rewritedMarkdown;
    entity.rewritedHTML = rewritedHTML;
    entity.originalPrompot = originalPrompot;
    entity.rewritedTitle = translatedTitle;
    return this.CrawlingTargetRepo.save(entity);
  }

  async rewritePostAnyOne() {
    const entity = await this.rewritableEntity();

    if (!entity) return null;

    try {
      const start = performance.now();

      const { contentHTML, title } = entity;
      console.log(`[info] START - entity.id : ${entity.id} ${entity.title}`);

      const { message: translatedTitle } =
        await this.gptService.translateTitleToEn(title);
      console.log('[info] translatedTitle : ', translatedTitle);

      const {
        total_tokens,
        message: rewritedPost,
        originalPrompot,
      } = await this.rewriteGpt(contentHTML);

      // console.log('-->rewritedPost', rewritedPost);
      // return rewritedPost;

      const convertor = new showdown.Converter();
      const rewritedHTML = convertor.makeHtml(rewritedPost);

      await this.rewriteSaveResult(
        entity,
        rewritedPost,
        rewritedHTML,
        originalPrompot,
        translatedTitle,
      );
      const end = performance.now();

      const executionTime = end - start;

      console.log(
        `[info] entity.id : ${entity.id} ${entity.title} Execution time: ${executionTime} milliseconds`,
      );

      console.log(
        '[info] length',
        String(rewritedPost).length,
        String(rewritedPost).substring(0, 20),
      );

      await this.gptLogRepo.save(
        this.gptLogRepo.create({
          targetId: entity.id,
          tokens: total_tokens,
          latency: executionTime,
        }),
      );

      return rewritedHTML;
    } catch (error) {
      console.error(error);
      entity.isError = true;
      await this.CrawlingTargetRepo.save(entity);
      return '';
    }
  }

  async backfillTitle() {
    const entity = await this.CrawlingTargetRepo.findOne({
      where: {
        rewritedTitle: IsNull(),
        isRewrited: true,
        isError: false,
      },
      order: {
        id: 'ASC',
      },
    });
    if (!entity) return null;

    const { title } = entity;
    const { message: translatedTitle } =
      await this.gptService.translateTitleToEn(title);

    const { originalPrompot } = await this.gptService.rewriteGpt(title, {
      dryRun: true,
    });
    console.log('[info] translatedTitle : ', translatedTitle);

    entity.rewritedTitle = translatedTitle;
    entity.originalPrompot = originalPrompot;
    return this.CrawlingTargetRepo.save(entity);
  }

  // consume
  async consumePost() {}
}
// 예외
// content = table인 경우
// 삭제된 데이터인 경우
