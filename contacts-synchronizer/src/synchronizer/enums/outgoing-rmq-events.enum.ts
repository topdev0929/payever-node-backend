export enum ContactsRmqEventsOutgoingEventsEnum {
  Create = 'contacts-synchronizer.event.outer-contact.create',
  Upsert = 'contacts-synchronizer.event.outer-contact.upsert',
}

export enum ThirdPartyRmqOutgoingEventsEnum {
  CallAction = 'synchronizer.event.action.call',
}

export enum ContactFilesRmqOutgoingEventsEnum {
  TriggerImport = 'contacts-synchronizer.event.file-import.triggered',
}

export enum MailerRmqOutgoingEventsEnum {
  Mail = 'payever.event.business.email',
}
