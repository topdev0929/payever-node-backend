export interface ArchivedTransactionInterface {
  uuid: string;
  businessId: string;

  data: object;
  encryptedData: string;
}
