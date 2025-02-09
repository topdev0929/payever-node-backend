import cubejs, { TimeDimensionGranularity, TimeDimensionRanged } from '@cubejs-client/core';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { MetricModel, WidgetModel } from '../models';
import { WidgetSettingTypeEnum, MetricEnum, ViewTypeValueEnum } from '../enums';
import { WidgetService } from './widget.service';
import { environment } from '../../environments';
import { WidgetSettingInterface } from '../interfaces';
import { MetricService } from './metric.service';
import * as Moment from 'moment';

@Injectable()
export class StatisticsService {
  constructor(
    protected readonly logger: Logger,
    private readonly widgetService: WidgetService,
    private readonly metricService: MetricService,
  ) { }

  public async getData(widget: WidgetModel): Promise<any> {
    this.logger.log(`Starting GetData for widget: ${widget._id}`);

    await widget.populate({ path: 'dashboard', populate: { path: 'business' } }).execPopulate();

    const widgetSettings: WidgetSettingInterface[][][] = widget.widgetSettings as WidgetSettingInterface[][][];

    return Promise.all(widgetSettings.map(row => {

      return Promise.all(row.map(cell => {
        const text: string = this.widgetService.resolveSetting(cell, WidgetSettingTypeEnum.Text);
        if (text || text === '' || !cell.length) {

          return Promise.resolve(text);
        } else {

          return this.getCubeJsDataForWidgetSettingsPromise(widget, cell);
        }
      }));
    }));
  }

  private async getCubeJsDataForWidgetSettingsPromise(
    widget: WidgetModel,
    cell: WidgetSettingInterface[],
  ) {
    const result: any = [];
    await this.getCubeJsDataForWidgetSettings(widget, cell, result);

    return result[0] ?? 0;
  }
  
  private async getCubeJsDataForWidgetSettings(
    widget: WidgetModel,
    rawWidgetSettings: WidgetSettingInterface[],
    result: any[],
  ): Promise<void> {
    try {

      const widgetSettings : WidgetSettingInterface[] = [];

      for (const row of rawWidgetSettings) {
        if (row.type === WidgetSettingTypeEnum.DaysAgo) {
          const numOfDaysAgo: Moment.Moment = Moment().subtract(row.value, 'day');
          const today: Moment.Moment = Moment();
          widgetSettings.push({ type: WidgetSettingTypeEnum.DateTimeFrom, value: numOfDaysAgo.format('YYYY-MM-DDT00:00:00.000') } as any);
          widgetSettings.push({ type: WidgetSettingTypeEnum.DateTimeTo, value: today.format('YYYY-MM-DDT23:59:59.999') } as any);
          continue;
        }
        widgetSettings.push(row);
      }
  
      const metrics: string[] = this.widgetService.resolveSettings(widgetSettings, WidgetSettingTypeEnum.Metric);
      const dimensions: string[] = this.widgetService.resolveSettings(widgetSettings, WidgetSettingTypeEnum.Dimension);
      const filters: any[] = this.widgetService.resolveSettings(widgetSettings, WidgetSettingTypeEnum.Filter);
      const granularity: any[] = this.widgetService.resolveSettings(widgetSettings, WidgetSettingTypeEnum.Granularity);
      const userInput: any[] = this.widgetService.resolveSettings(widgetSettings, WidgetSettingTypeEnum.UserInput);
      const jwtSignElement: any = userInput[0] ? {
        [`${userInput[0].name}`] : userInput[0].value,
      } : { };

      const metricsData: MetricModel[] = await this.metricService.findAll({ name: { $in: metrics } });

      const cubeJsResponse: any = await this.doCubeJsApiCall(
        widget,
        widgetSettings,
        dimensions,
        filters,
        metrics,
        jwtSignElement,
      );

      await this.processCubeJsResponse(
        cubeJsResponse,
        result,
        widget,
        filters,
        metrics,
        granularity,
        metricsData,
      );
    } catch (err) {
      this.logger.warn(`GetData cubejs error: ${err.message}`);
      throw new HttpException(err.message, HttpStatus.PRECONDITION_FAILED);
    }
  }

  private async doCubeJsApiCall(
    widget: WidgetModel,
    widgetSettings: WidgetSettingInterface[],
    dimensions: string[],
    filters: any[],
    metrics: string[],
    jwtTokenValue: any,
  ): Promise<any> {
    return cubejs(
      jwt.sign(jwtTokenValue, environment.cubejs.apiSecret, {
        expiresIn: '180d',
      }),
      { apiUrl: `${ environment.cubejs.host }/cubejs-api/v1` },
    ).load({
      dimensions: dimensions.map((dimension: string) => `${ widget.type }.${ dimension }`),
      filters: (filters || []).map((filter: any) => ({
        member: `${ widget.type }.${ filter.name }`,
        operator: filter.operator || 'equals',
        values: filter.values ? filter.values : [filter.value],
      })),
      measures: metrics.map((metric: string) => `${ widget.type }.${ metric }`),
      timeDimensions: this.resolveTimeDimensions(widgetSettings, widget.type),
    });
  }

  private async processCubeJsResponse(
    cubeJsResponse: any,
    result: any[],
    widget: WidgetModel,
    filters: any[],
    metrics: string[],
    granularity: any[],
    metricsData?: MetricModel[],
  ): Promise<void> {
    const mainData: any = cubeJsResponse?.loadResponse?.results[0]?.data[0];

    if (!mainData) {
      result.push(
        this.decorateSuffix(0, metrics, filters, metricsData),
      );

      return;
    }

    const mainDataKey: string = Object.keys(mainData || { }).find(
      (k: string) => !k.startsWith(`${ widget.type }.createdAt`),
    );

    const firstBucket: any = mainData[mainDataKey];

    if (typeof firstBucket !== 'number' && firstBucket !== null) {
      result.push(firstBucket);

      return;
    }

    if (widget.viewType === ViewTypeValueEnum.LineGraph && result.length === 1) {
      const bucketArray: any[] = [];
      for (const bucket of cubeJsResponse?.loadResponse?.results[0]?.data) {
        const bucketValue: number = bucket[mainDataKey];

        bucketArray.push({
          name: bucket[`${ widget.type }.createdAt.${ granularity }`],
          value: bucketValue,
        });
      }
      result.push([{
        name: `line ${ result.length }`,
        series: bucketArray,
      }]);

      return;
    }

    let totalSum: number = 0;
    for (const bucket of cubeJsResponse?.loadResponse?.results[0]?.data) {
      const bucketValue: number = bucket[mainDataKey];

      if (bucketValue !== null) {
        totalSum += bucketValue;
      }
    }

    result.push(
      this.decorateSuffix(totalSum, metrics, filters, metricsData),
    );
  }

  private decorateSuffix(result: number, metrics: string[], filters: any[], metricsData: MetricModel[]): any {
    const sufixMetric: MetricModel = metricsData.find((a: MetricModel) => !!a.suffix);
    if (sufixMetric) {
      return result + sufixMetric.suffix;
    }

    const currency: any = filters.find((obj: any) => obj.name === 'currency');

    if ((metrics.includes('revenue') || metrics.includes('revenueAll')) &&
      currency && currency.value) {
      return {
        currency: currency.value,
        value: result,
      };
    }

    return result;
  }

  private resolveTimeDimensions(
    widgetSettings: WidgetSettingInterface[],
    widgetType: string,
  ): TimeDimensionRanged[] {
    const granularity: TimeDimensionGranularity = this.widgetService.resolveSetting(
      widgetSettings,
      WidgetSettingTypeEnum.Granularity,
    );
    const dateTimeFrom: string = this.widgetService.resolveSetting(widgetSettings, WidgetSettingTypeEnum.DateTimeFrom);
    const dateTimeTo: string = this.widgetService.resolveSetting(widgetSettings, WidgetSettingTypeEnum.DateTimeTo);
    const dateTimeRelative: string = this.widgetService.resolveSetting(
      widgetSettings, 
      WidgetSettingTypeEnum.DateTimeRelative,
    );

    const timeDimension: TimeDimensionRanged = {
      dimension: `${ widgetType }.createdAt`,
    };

    if (dateTimeFrom && dateTimeTo) {
      timeDimension.dateRange = [dateTimeFrom, dateTimeTo] as never;
    } else if (dateTimeRelative) {
      timeDimension.dateRange = dateTimeRelative;
    }

    if (granularity) {
      timeDimension.granularity = granularity;
    }

    return [timeDimension];
  }

  // tslint:disable-next-line
  private resolveGrowthRates(widget: WidgetModel, results: any): any {
    const res: any = [];

    results.forEach((result: any, i: number) => {
      result.data.forEach((row: any, index: number) => {
        // eslint-disable-next-line
        for (const item in MetricEnum) {

          const alias: string = this.widgetService.resolveSetting(
            widget.widgetSettings[i] as WidgetSettingInterface[],
            WidgetSettingTypeEnum.Alias,
          );

          if (isNaN(Number(item)) && `${ widget.type }.${ MetricEnum[item] }` in result.data[index]) {
            if (alias) {
              row.alias = alias;
            }
            if (index === 0) {
              row[`${ widget.type }.${ MetricEnum[item] }Growth`] = Math.floor(Math.random() * 101) - 50;
            } else {
              row[`${ widget.type }.${ MetricEnum[item] }Growth`] = row[`${ widget.type }.${ MetricEnum[item] }`]
                - result.data[index - 1][`${ widget.type }.${ MetricEnum[item] }`];
            }
          }
        }

        res.push(row);
      });
    });

    return res;
  }
}
