import * as createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window: any = new JSDOM('').window;
const DOMPurify: any = createDOMPurify(window);

export class DomPurifyTools {
  public static sanitize(s: string): string {
    return DOMPurify.sanitize(s);
  }
}
