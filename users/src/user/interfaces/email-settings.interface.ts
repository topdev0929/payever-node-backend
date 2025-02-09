import { OutgoingServerSettingsInterface } from './outgoing-server-settings.interface';
export interface EmailSettingsInterface {
    business: string;
    description: string;
    outgoingServerSettings: OutgoingServerSettingsInterface;
}
