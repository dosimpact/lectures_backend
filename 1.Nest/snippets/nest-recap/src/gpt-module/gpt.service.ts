import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  getMarkdownMessage,
  getUnsplashImage,
} from '../gpt-module/prompts/system';
import {
  getRewritePostMarkdownMessage,
  getTraslateTitleMessage,
} from '../gpt-module/prompts/user';
import axios from 'axios';

const getRewritePrompt = ({ originalPost = '' }) => {
  const messages = [];

  messages.push(getMarkdownMessage());
  messages.push(getUnsplashImage());
  messages.push(getRewritePostMarkdownMessage(originalPost));

  return messages;
};

const getOriginalPrompt = (messages: any) => {
  return (messages || []).map((e) => e.content).join('\n');
};

const getTranslatePrompt = (title: string) => {
  const messages = [];

  messages.push(getTraslateTitleMessage(title));

  return messages;
};

@Injectable()
export class GptService {
  constructor(private readonly configService: ConfigService) {}

  async rewriteGpt(originalPost: string, { dryRun = false } = {}) {
    const key = this.configService.get('GPT_AD');
    const messages = getRewritePrompt({ originalPost });
    const originalPrompot = getOriginalPrompt(messages);

    if (dryRun) return { message: '', total_tokens: 0, originalPrompot };

    const response = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      data: {
        model: 'gpt-3.5-turbo-1106',
        messages,
        temperature: 0.7,
        max_tokens: 1_000,
        // response_format: { type: 'json_object' },
      },
    });
    console.log('[info] gpt response', JSON.stringify(response.data));
    const message = response.data.choices?.[0].message.content;
    const total_tokens = response.data.usage?.total_tokens;

    return { message, total_tokens, originalPrompot };
  }

  async translateTitleToEn(title: string) {
    const key = this.configService.get('GPT_AD');
    const messages = getTranslatePrompt(title);
    const originalPrompot = getOriginalPrompt(messages);

    const response = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      data: {
        model: 'gpt-3.5-turbo-1106',
        messages,
        temperature: 0.7,
        max_tokens: 1_000,
        // response_format: { type: 'json_object' },
      },
    });
    console.log('[info] gpt response', JSON.stringify(response.data));
    const message = response.data.choices?.[0].message.content;
    const total_tokens = response.data.usage?.total_tokens;

    return { message, total_tokens, originalPrompot };
  }
}
/**
ê¸ˆìˆ˜ì €


 */
