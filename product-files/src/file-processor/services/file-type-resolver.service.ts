import { Injectable } from '@nestjs/common';

@Injectable()
export class FileTypeResolverService {
  public getType(data: string): string {
    return this.isXml(data) ? 'xml' : 'csv';
  }

  private isXml(data: string): boolean {
    return data.substr(0, 5) === '<?xml';
  }
}
