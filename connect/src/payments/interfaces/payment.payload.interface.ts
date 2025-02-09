export interface PaymentPayloadInterface {
  application_sent?: boolean;
  documents?: PaymentDocumentPayloadInterface[];
}

export interface PaymentDocumentPayloadInterface {
  name: string;
  fileName: string;
  type: string;
  blobName: string;
}
