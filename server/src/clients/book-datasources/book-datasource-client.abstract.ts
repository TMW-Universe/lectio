import { Datasource } from '@prisma/client';
import { BookDatasourceStandard } from '../../types/datasources/book-datasource-standard.enum';
import axios, { AxiosRequestConfig } from 'axios';
import * as https from 'https';
import { AES, enc } from 'crypto-js';
import { getEnv } from '../../utils/config/get-env';
import { uuid } from '@tmw-universe/tmw-universe-types';
import { Stream } from 'stream';

const { decrypt } = AES;

export abstract class BookDatasourceClient {
  public readonly apiKey: string;
  public readonly standard: BookDatasourceStandard;

  constructor(public readonly datasource: Datasource) {
    this.apiKey = decrypt(
      datasource.apiKey,
      getEnv().scrapperApiKeyEncKey,
    ).toString(enc.Utf8);
    this.standard = datasource.standard as BookDatasourceStandard;
  }

  public getCode = () => this.datasource.code;
  public getId = () => this.datasource.id as uuid;

  // Requests

  async request<T extends object>(
    path: string,
    axiosConfig?: Omit<AxiosRequestConfig, 'url' | 'httpsAgent'>,
  ) {
    const res = await axios.request<T>({
      ...axiosConfig,
      url: `${this.datasource.url}/${path}`,
      headers: {
        'api-key': this.apiKey,
        ...axiosConfig?.headers,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
    return res.data;
  }

  async getImageByUrl(url: string) {
    return await this.request<Stream>(`image/url/${encodeURIComponent(url)}`, {
      responseType: 'stream',
    });
  }
}
