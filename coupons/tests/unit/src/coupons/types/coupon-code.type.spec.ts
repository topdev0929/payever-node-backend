import 'mocha';
import { expect } from 'chai';

import {
    generate,
    generatedRegExp,
    manualRegExp,
} from '../../../../../src/coupons/types/coupon-code.type';

describe('coupon code', () => {
    it('should match any generated code to generatedRegExp', () => {
        for (let i: number = 0; i < 50; i++) {
            const generated: string = generate();
            expect(generated).to.match(generatedRegExp);
        }
    });
    it('should match some manual code', () => {
        expect('A').to.match(manualRegExp);
        expect('0').to.match(manualRegExp);
        expect('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA').to.match(manualRegExp);
        expect('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ').to.match(manualRegExp);
        expect('00000000000000000000000000000000').to.match(manualRegExp);
        expect('_').to.match(manualRegExp);
        expect('-').to.match(manualRegExp);
    });
    it('should not match some manual code', () => {
        expect('a').not.to.match(manualRegExp);
        expect('').not.to.match(manualRegExp);
        expect('!').not.to.match(manualRegExp);
    });
});



