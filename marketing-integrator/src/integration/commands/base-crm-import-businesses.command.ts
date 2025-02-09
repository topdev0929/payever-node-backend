import { Injectable, Logger } from '@nestjs/common';
import { Argv, Command } from '@pe/nest-kit';
import * as csvParser from 'csv-parser';
import * as path from 'path';
import * as fs from 'fs';

import { BaseCrmClientService } from '../../base-crm/services';
import { BaseCrmCustomFieldsEnum } from '../../base-crm/enum';
import { BusinessSynchronizerService } from '../services';
import { BaseCrmContactInterface } from '../../base-crm/interfaces';

/*

Select inside checkout-php MySQL and export it as CSV file to feed this command with:

select distinct
	group_concat(p.business_id) as business_id,
	pua.first_name,
	pua.last_name,
	pua.email,
	count(p.id) as transaction_volume,
	sum(p.total_base_currency) as transaction_amount
from payments p
	left join projections__businesses pb on p.business_id = pb.uuid
	left join projections__user_account pua on pb.user_uuid = pua.uuid
where p.created_at > "2019-09-01 00:00:00"
group by pua.email
;

*/

interface CsvFileLineInterface {
  business_id: string;
  transaction_volume: number;
  transaction_amount: number; // EUR (!)
}

@Injectable()
export class BaseCrmImportBusinessesCommand {
  constructor(
    private readonly businessSyncrhonizerService: BusinessSynchronizerService,
    private readonly baseCrmClientService: BaseCrmClientService,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'crm:import:business',
    describe: 'Imports businesses into Base CRM from CSV file',
  })
  public async import(
    @Argv() argv: any,
  ): Promise<void> {
    const filename: string = path.join(process.cwd(), argv._[1]);
    const fileStream: any = fs.createReadStream(filename).pipe(csvParser());
    let imported: number = 0;
    let total: number = 0;

    const errors: string[] = [];

    for await (const line of fileStream) {
      total++;

      try {
        const id: number = await this.processLine(line);

        this.logger.log({ message: `Populated CRM contact id ${id}`, data: line });

        imported++;
      } catch (e) {
        const message: string = `Unable to import business ${line.business_id}: ${e.message}`;
        errors.push(message);

        this.logger.error(message);
      }
    }

    this.logger.log(`Imported ${imported} out of ${total} businesses`);

    if (errors.length) {
      this.logger.log(`Errors:\n ${errors.join('\n')}`);
    }
  }

  private async processLine(line: CsvFileLineInterface): Promise<number> {
    if (!line.business_id) {
      throw new Error(`Business Id can not be empty: ${JSON.stringify(line)}`);
    }

    const contact: BaseCrmContactInterface = await this.businessSyncrhonizerService
      .syncBusinessUserAccountWithCrmContact(line.business_id.split(',').shift());

    await this.baseCrmClientService.updateContact(contact.id, {
      custom_fields: {
        [BaseCrmCustomFieldsEnum.TransactionAmount]: Number(line.transaction_amount),
        [BaseCrmCustomFieldsEnum.TransactionVolume]: Number(line.transaction_volume),
      },
    });

    return contact.id;
  }
}
