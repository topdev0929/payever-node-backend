export interface ContactsAppContactFieldRpcResponseDto {
  _id: string;
  value: string;
  field: {
    _id: string;
    name: string;
    type: string;
  };
}

export interface ContactsAppContactRpcResponseDto {
  _id: string;
  fields: ContactsAppContactFieldRpcResponseDto[];
}
