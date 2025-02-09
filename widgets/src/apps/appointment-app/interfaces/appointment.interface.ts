export interface AppointmentInterface {
  businessId?: string;
  allDay: boolean;
  repeat: boolean;
  date?: string;
  time?: string;
  location?: string;
  note?: string;
}
