import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrawlingTargetEntity } from './entities/crawlingTarget.entity';
import { IsNull, Repository, Not } from 'typeorm';
import * as fs from 'fs/promises';
import { join } from 'path';
import { mkdirp } from 'mkdirp';

// const outputPath = 'static/';

function removeSpecialCharacters(fileName: string) {
  const forbiddenChars = /[/\\:*?"<>|]/g;
  return fileName.replace(forbiddenChars, '');
}

const saveToFile = async (
  title: string,
  fileStr: string,
  ext: string,
  consumeTo = 'default',
) => {
  const parsedTitle = removeSpecialCharacters(title);
  const outputPath = join(`static/${consumeTo}/`);
  const outputPathName = join(`static/${consumeTo}/`, `${parsedTitle}.${ext}`);
  await mkdirp(outputPath);

  try {
    await fs.writeFile(outputPathName, fileStr);
  } catch (error) {
    throw new Error(error);
  }
};

@Injectable()
export class ConsumerService {
  private readonly log = new Logger(ConsumerService.name);

  constructor(
    @InjectRepository(CrawlingTargetEntity)
    private readonly CrawlingTargetRepo: Repository<CrawlingTargetEntity>,
  ) {}

  async consumePost(consumedTo = 'consumedTo') {
    const entity = await this.CrawlingTargetRepo.findOne({
      where: {
        rewritedTitle: Not(IsNull()),
        isConsumed: false,
        isRewrited: true,
        isError: false,
      },
      order: {
        id: 'ASC',
        // id: !(Math.floor(Math.random() * 10) % 2) ? 'ASC' : 'DESC',
      },
    });
    if (!entity) return null;
    this.log.verbose(
      `start - consume post ${entity.rewritedTitle} to ${consumedTo}`,
    );

    const { title, rewritedMarkdown, rewritedHTML } = entity;

    await saveToFile(title, rewritedMarkdown, 'md', consumedTo); // download in local markdown
    await saveToFile(title, rewritedHTML, 'html', consumedTo); // download in local html

    // flag up consumed
    entity.isConsumed = true;
    entity.consumedTo = consumedTo;
    await this.CrawlingTargetRepo.save(entity);

    this.log.verbose(
      `end - consume post ${entity.rewritedTitle} to ${entity.consumedTo}`,
    );
  }
}
