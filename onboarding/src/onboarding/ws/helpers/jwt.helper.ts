import * as jsonpack from 'jsonpack';
import { decode as jwtDecode, verify as jwtVerify } from 'jsonwebtoken';
import { JWTInterface } from '../../interfaces';
import { environment } from '../../../environments';

export class JwtHelper {
  public static verify(token: string): boolean {
    try {
      jwtVerify(token, environment.jwtOptions.secret);
    } catch (e) {
      return false;
    }

    return true;
  }

  public static unpack(token: string): JWTInterface {
    let jwtDecoded: any = jwtDecode(token);
    try {
      jwtDecoded = jsonpack.unpack(jwtDecoded);
    } catch (e) { }

    return jwtDecoded;
  }
}
