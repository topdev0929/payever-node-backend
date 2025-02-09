export interface PaymentPayloadInterface {
  payment: {
    id: string;
    uuid: string;
    total: number;
    payment_type: string;

    address: {
      first_name: string;
      last_name: string;
      email: string;
      country: string;
      city: string;
      zip_code: string;
      street: string;
      phone: string;
    };

    payment_flow: {
      id: string;
    };
  };
}
