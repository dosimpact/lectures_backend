import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  getMarkdownMessage,
  getUnsplashImage,
} from '../gpt-module/prompts/system';
import { getRewritePostMarkdownMessage } from '../gpt-module/prompts/user';
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

@Injectable()
export class GptService {
  constructor(private readonly configService: ConfigService) {}

  async rewriteGpt(originalPost: string) {
    const key = this.configService.get('GPT_AD');
    const messages = getRewritePrompt({ originalPost });
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
      },
    });
    console.log('[info] gpt response', JSON.stringify(response.data));
    const message = response.data.choices?.[0].message.content;
    const total_tokens = response.data.usage?.total_tokens;

    return { message, total_tokens, originalPrompot };
  }
}
/**
 * 
ê¸ˆìˆ˜ì €


 */
