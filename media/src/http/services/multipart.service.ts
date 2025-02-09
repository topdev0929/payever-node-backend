import { Injectable } from '@nestjs/common';

@Injectable()
export class MultipartService {
  public async handleFiles<T, U>(
    files: U[],
    fileHanlderFN: (file: U) => Promise<T>,
  ): Promise<T | T[]> {
    const results: T[] = await Promise.all(files.map(fileHanlderFN));

    return results.length > 1 ? results : results[0];
  }
}
