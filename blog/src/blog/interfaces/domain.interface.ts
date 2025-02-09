import { BlogInterface } from './blog.interface';

export interface DomainInterface {
    name: string;
    isConnected: boolean;

    blog: BlogInterface;
}
