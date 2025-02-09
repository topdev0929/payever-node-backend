import { After, Before, Given, HookScenarioResult } from '@cucumber/cucumber';
import { AbstractWorld, ContextInterface } from '@pe/cucumber-sdk';
import { SharedStorage } from '@pe/cucumber-sdk/module/storage';
import * as dateFns from 'date-fns';

export class CurrentDateContext implements ContextInterface {
  public resolve(): void {

    Before(async function (scenario: HookScenarioResult): Promise<void> {
      await this.init(scenario);
    });

    After(async function (): Promise<void> {
      await this.close();
    });

    Given(
      /^I create date and remember it as "([^"]*)"/, async function (
        this: AbstractWorld,
        key: string,
    ): Promise<void> {

      const curDay: Date = new Date();
      SharedStorage.set(key, curDay);
    });

    Given(
      /^I create date and modify it with "([^\s]*)\s([^"]*)" and remember it as "([^"]*)"/, async function (
        this: AbstractWorld,
        date_modif_count: number,
        date_modif_fn: string,
        key: string,
    ): Promise<void> {

      const curDay: Date = new Date();
      let modifiedDate: Date;

      switch (date_modif_fn) {
        case 'seconds':
          modifiedDate = dateFns.addSeconds(curDay, date_modif_count);
          break;
        case 'minutes':
          modifiedDate = dateFns.addMinutes(curDay, date_modif_count);
          break;
        case 'hours':
          modifiedDate = dateFns.addHours(curDay, date_modif_count);
          break;
        case 'weeks':
          modifiedDate = dateFns.addWeeks(curDay, date_modif_count);
          break;
        case 'days':
          modifiedDate = dateFns.addDays(curDay, date_modif_count);
          break;
        case 'months':
          modifiedDate = dateFns.addMonths(curDay, date_modif_count);
          break;
        case 'quarters':
          modifiedDate = dateFns.addQuarters(curDay, date_modif_count);
          break;
        case 'years':
          modifiedDate = dateFns.addYears(curDay, date_modif_count);
          break;
        default:
          modifiedDate = curDay;
          break;
      }
      SharedStorage.set(key, modifiedDate);
    });

  }
}
