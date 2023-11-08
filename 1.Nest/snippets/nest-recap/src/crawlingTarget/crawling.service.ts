import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { CrawlingTargetEntity } from './entities/crawlingTarget.entity';
import { Repository } from 'typeorm';

const kinHost = 'https://kin.naver.com';
const getKinUrlTemplate = ({ page, svc }) =>
  `https://kin.naver.com/best/listaha.naver?svc=${svc}&page=${page}`;

export class CrawlingService {
  constructor(
    @InjectRepository(CrawlingTargetEntity)
    private readonly CrawlingTargetRepo: Repository<CrawlingTargetEntity>,
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
}
