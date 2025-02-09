import * as chai from 'chai';
import { describe, beforeEach, it } from "mocha";
import { TwingEnvironment, TwingLoaderArray } from 'twing';

const expect: Chai.ExpectStatic = chai.expect;

describe('twing tests', () => {
    let twing: TwingEnvironment;
    let loader: TwingLoaderArray;
    beforeEach(() => {
        loader = new TwingLoaderArray({
            template1: `<div>{{ existingValue }}</div>`,
            template2: `{% if existingValue %} {{existingValue}} {% endif %}`,
            template3: `source:{% if obj.val %} {{obj.val}} {% endif %}`,
            template4: `{% if obj.val is defined %} {{ obj.val }} {% endif %}`,
            template5: `{% if obj is defined %}{% if obj.prop is defined %} {{ obj.prop }} {% endif %}{% endif %}`,
        });
        twing = new TwingEnvironment(loader);
        twing.enableStrictVariables();
    });
    it('should render existing value', () => {
        const result: string = twing.render('template1', {
            existingValue: 'i am here',
        });
        expect(result).to.equal('<div>i am here</div>');
    });
    it('should not render if value is null', () => {
        const result: string = twing.render('template2', {
            existingValue: null,
        });
        expect(result).to.equal('');
    });
    it('should not render if value is ""', () => {
        const result: string = twing.render('template2', {
            existingValue: '',
        });
        expect(result).to.equal('');
    });
    it('should not render if value in object not exists', () => {
        const result: string = twing.render('template3', {
            obj: {
                val: undefined,
            },
        });
        expect(result).to.equal('source:');
    });
    it('should not render if obj has no prop', () => {
        const result: string = twing.render('template4', {
            obj: {},
        });
        expect(result).to.equal('');
    });
    it('should throw if obj has no prop', () => {
        expect(() => {
            twing.render('template3', {
                obj: {},
            });
        }).to.throw();
    });
    it("should render template with root obj is defined", () => {
        const result: string = twing.render('template5', {
            obj: {
                prop: 4,
            },
        });
        expect(result).to.equal(' 4 ');
    });
});
