import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CountryModel, CountryService, CurrencyModel, CurrencyService } from '@pe/common-sdk';
import { Model } from 'mongoose';
import { TwingEnvironment, TwingErrorRuntime, TwingFilter, TwingLoaderArray } from 'twing';
import { ApmService } from '@pe/nest-kit';
import { omit } from 'lodash';

import { environment } from '../../environments';
import { RenderedMailDto } from '../dto';
import { Template } from '../interfaces';
import { TemplateSchemaName } from '../schemas';
import {
  CountryNameFilter,
  CurrencySymbolFilter,
  FormatDateTwigFilter,
  MediaUrlFilter,
  NumberFormatTwigFilter,
  PaymentOptionDETwigFilter,
  PaymentOptionTwigFilter,
} from './twig';
import { AttachmentInterface } from '../interfaces/attachment.interface';
import { EmailTemplateLocaleEnum } from '../enum';

@Injectable()
export class EmailRenderer {
  private static twing: TwingEnvironment;
  private defaultLanguage: string;

  constructor(
    private readonly logger: Logger,
    @InjectModel(TemplateSchemaName) private readonly templateModel: Model<Template>,
    private readonly currencyService: CurrencyService,
    private readonly countryService: CountryService,
    private readonly apmService: ApmService,
  ) {
    this.defaultLanguage = environment.defaultLanguage;
  }

  public async render(templateName: string, params: any): Promise<RenderedMailDto> {
    this.logger.verbose(
      'Transformed params for template compilation, right before the rendering (without attachments):',
    );
    this.logger.verbose(omit(params, ['attachments']));

    const emailTemplate: Template = await this.getTemplate(templateName, params.locale);

    if (!emailTemplate) {
      throw new NotFoundException(`Template with a key '${templateName}' is not found while rendering an email.`);
    }

    let attachments: AttachmentInterface[] = emailTemplate.attachments || [];

    const isTemplate: (layout?: string | Template | null) => layout is Template = (
      layout?: string | Template | null,
    ): layout is Template => {
      return typeof layout !== 'string' && layout !== null;
    };

    if (
      isTemplate(emailTemplate.layout) &&
      Array.isArray(emailTemplate.layout.attachments) &&
      emailTemplate.layout.attachments.length
    ) {
      attachments = attachments.concat(emailTemplate.layout.attachments);
    }

    const localeSuffix: string = emailTemplate.locale ? '.' + emailTemplate.locale : '';

    return {
      attachments,
      html: await this.reallyRender(templateName + '.body' + localeSuffix, params),
      subject: await this.reallyRender(templateName + '.subject' + localeSuffix, params),
    };
  }

  private async reallyRender(template: string, params: any): Promise<string> {
    try {
      const twing: TwingEnvironment = await this.getTwing(params.locale);
      twing.enableStrictVariables();
      /* eslint-disable-next-line */
      const result: string = await twing.render(template, params);

      if (result.match(/(Promise|Object)/)) {
        throw new TwingErrorRuntime(
          `An error occurred during template ${template} compilation: Object or Promise variable rendered`,
        );
      }

      return result;
    } catch (e) {
      if (e instanceof TwingErrorRuntime) {
        if (!environment.production) {
          throw e;
        }

        this.logger.error('Error e-mail template compilation');
        this.logger.error(e);
        this.apmService.captureError(e);

        (await this.getTwing(params.locale)).disableStrictVariables();

        return (await this.getTwing(params.locale)).render(template, params);
      }

      throw e;
    }
  }

  private async getTwing(locale: string): Promise<TwingEnvironment> {
    if (EmailRenderer.twing) {
      return EmailRenderer.twing;
    }

    const [templateEntities, currencies, countries]: [Template[], CurrencyModel[], CountryModel[]] = await Promise.all([
      this.templateModel.find({ }),
      this.currencyService.findAll(),
      this.countryService.findAll(),
    ]);

    const templates: any = { };

    for (const templateEntity of templateEntities) {
      const localeSuffix: string = templateEntity.locale ? '.' + templateEntity.locale : '';
      if (templateEntity.use_layout && templateEntity.layout) {
        const layout: Template = EmailRenderer.getLayout(templateEntities, templateEntity.layout as string);
        if (layout) {
          templateEntity.body = `{% extends "${layout.template_name}.body${localeSuffix}" %}
            {% block body %}${templateEntity.body}{% endblock body %}`;
        }
      }

      templates[templateEntity.template_name + '.body' + localeSuffix] = templateEntity.body;
      templates[templateEntity.template_name + '.subject' + localeSuffix] = templateEntity.subject;
    }

    const loader: TwingLoaderArray = new TwingLoaderArray(templates);

    EmailRenderer.twing = new TwingEnvironment(loader, {
      debug: environment.twigDebug !== undefined ? environment.twigDebug : !environment.production,
    });

    EmailRenderer.twing.addFilter(new TwingFilter('number_format_currency', NumberFormatTwigFilter.filter));
    if (locale === 'de') {
      EmailRenderer.twing.addFilter(new TwingFilter('payment_option', PaymentOptionDETwigFilter.filter));
    } else {
      EmailRenderer.twing.addFilter(new TwingFilter('payment_option', PaymentOptionTwigFilter.filter));
    }
    EmailRenderer.twing.addFilter(new TwingFilter('format_date', FormatDateTwigFilter.filter));
    EmailRenderer.twing.addFilter(
      new TwingFilter('currency_symbol', (value: string): string => CurrencySymbolFilter.filter(value, currencies)),
    );
    EmailRenderer.twing.addFilter(
      new TwingFilter('country_name', (value: string): string => CountryNameFilter.filter(value, countries)),
    );
    EmailRenderer.twing.addFilter(new TwingFilter('media_url', MediaUrlFilter.filter));

    return EmailRenderer.twing;
  }

  private static getLayout(templateEntities: Template[], layoutId: string): null | Template {
    for (const template of templateEntities) {
      if (template._id === layoutId) {
        return template;
      }
    }
  }

  private async getTemplate(templateName: string, locale: EmailTemplateLocaleEnum): Promise<Template> {
    let template: Template;
    const availableLocales: EmailTemplateLocaleEnum[] = [
      EmailTemplateLocaleEnum.en,
      EmailTemplateLocaleEnum.de,
      EmailTemplateLocaleEnum.da,
      EmailTemplateLocaleEnum.es,
      EmailTemplateLocaleEnum.nl,
    ];
    locale = locale && availableLocales.includes(locale) ? locale : EmailTemplateLocaleEnum.en;

    template = await this.templateModel
      .findOne({ template_name: templateName, locale })
      .populate('layout').exec();

    if (!template) {
      template = await this.templateModel
        .findOne({ template_name: templateName, locale: this.defaultLanguage })
        .populate('layout').exec();
    }

    if (!template) {
      template = await this.templateModel
        .findOne({
          template_name: templateName,
        })
        .populate('layout').exec();
    }

    return template;
  }
}
