import { Document } from 'mongoose';

import { ThemeInterface } from '../interfaces';

export interface ThemeModel extends ThemeInterface, Document {
}
