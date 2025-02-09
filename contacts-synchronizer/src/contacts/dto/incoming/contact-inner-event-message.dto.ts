export interface Synchronization {
  taskId: string;
  taskItemId: string;
}

export interface ContactsSynchronizationIncomingEventMessageDto {
  synchronization: Synchronization;
  contact: ContactDto;
  fields: ContactFieldDto[];
}

export interface ContactFieldDto {
  value: string;
  name: string;
  fieldId: string;
}

export interface ContactDto {
  _id: string;
  businessId: string;
}

export interface ContactIncomingEventMessageDto {
  contact: ContactDto;
  fields: ContactFieldDto[];
}
