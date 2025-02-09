import * as chai from 'chai';
import 'mocha';
import * as sinon from 'sinon';
import { FastifyResponse } from '../../../src/common/interfaces/fastify-response.interface';
import { TokenCookieWriter } from '../../../src/common/token-to-response.writer';

const expect: Chai.ExpectStatic = chai.expect;

describe('token to cookie writer', () => {
    let writer: TokenCookieWriter;
    let response: FastifyResponse;
    let headerFnSpy: sinon.SinonSpy;
    beforeEach(() => {
        writer = new TokenCookieWriter;
        response = ({ }) as any;
        headerFnSpy = sinon.spy();
        response.header = headerFnSpy;
    });

    it('should serialize cookie object into string', () => {
        // tslint:disable-next-line: no-string-literal
        const cookiesObjectToString: typeof TokenCookieWriter.prototype['cookiesObjectToString'] = writer['cookiesObjectToString'];
        expect(cookiesObjectToString({
            key1: 'value1',
            key2: 'value3',
        })).to.equal('key1=value1;key2=value3');
    });

    it('should set token into cookie', () => {
        writer.setTokenToCookie(response, {
            accessToken: 'accessTokenValue',
            refreshToken: 'refreshTokenValue',
        });
        expect(headerFnSpy.args[0][0]).to.equal('Set-Cookie');
        expect(headerFnSpy.args[0][1]).to.equal(`pe_auth_token=accessTokenValue;pe_refresh_token=refreshTokenValue;domain=.${process.env.TOKEN_IN_COOKIE_DOMAIN};path=/;Max-Age=2592000;SameSite=None;Secure`);
    });

    it('should unset token into cookie', () => {
        writer.unsetTokenInCookie(response);
        expect(headerFnSpy.args[0][0]).to.equal('Set-Cookie');
        expect(headerFnSpy.args[0][1]).to.equal(`pe_auth_token=;pe_refresh_token=;domain=.${process.env.TOKEN_IN_COOKIE_DOMAIN};path=/;Max-Age=0;SameSite=None;Secure`);
    });
});
