import { MappedFolderItemInterface } from '@pe/folders-plugin';
import { TransactionExportDto } from '../dto';
import { TransactionModel } from '../models';

export class MappingHelper {
  public static map(
    data: TransactionModel | TransactionExportDto,
  ): MappedFolderItemInterface {
    const paymentDetails: any = JSON.parse(data.payment_details);
    const customerPspId: string = MappingHelper.getCustomerPspId(paymentDetails);
    const applicationId: string = MappingHelper.getApplicationId(paymentDetails);

    let dataObj: any;
    try {
      dataObj = (data as TransactionModel)?.toObject() || data;
    } catch (e) {
      dataObj = data;
    }
    
    return {
      ...dataObj,
      _id: (data as TransactionModel)?._id || (data as TransactionExportDto)?.uuid,
      applicationId: applicationId,
      businessId: (data as TransactionModel)?.business_uuid || (data as TransactionExportDto)?.business?.uuid,
      customer_psp_id: customerPspId,
      title: paymentDetails?.customer?.personal_title,
      userId: (data as TransactionModel)?.user_uuid,
    };
  }

  public static getApplicationId(paymentDetails: any): string {
    let applicationId: string = null;
    if (paymentDetails) {
      applicationId =
        paymentDetails?.application_no ||
        paymentDetails?.application_number ||
        paymentDetails?.applicationNumber ||
        paymentDetails?.applicationNo;
    }

    return applicationId;
  }

  public static getCustomerPspId(paymentDetails: any): string {
    let customerPspId: string = null;
    if (paymentDetails) {
      customerPspId =
        paymentDetails?.pan_id ||
        paymentDetails?.panId ||
        paymentDetails?.usage_text ||
        paymentDetails?.usageText ||
        paymentDetails?.case_id ||
        paymentDetails?.caseId ||
        MappingHelper.getApplicationId(paymentDetails);
    }

    return customerPspId;
  }
}
