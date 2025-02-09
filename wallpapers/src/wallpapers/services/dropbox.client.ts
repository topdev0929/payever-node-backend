import { HttpService, Injectable } from '@nestjs/common';
import { environment } from '../../environments';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import { Dropbox } from 'dropbox';
import * as fetch from 'isomorphic-fetch';

@Injectable()
export class DropboxClient {
  private dropBoxAccessToken: string;
  private dropbox: Dropbox;
  constructor(private readonly httpService: HttpService) {
    this.dropBoxAccessToken = environment.dropBoxAccessToken;
    this.dropbox = new Dropbox({
      accessToken: this.dropBoxAccessToken,
      fetch: fetch,
    });
  }

  public async downloadToTemporaryFile(path: string): Promise<string> {
    const tmpFile: string = `/tmp/${uuid()}`;
    const result: { link: string } = await this.dropbox.filesGetTemporaryLink({ path: path.trim() });

    const response = await new HttpService()
      .get(result.link, { responseType: 'stream' })
      .toPromise();

    fs.writeFileSync(tmpFile, response.data);

    return tmpFile;
  }
}
