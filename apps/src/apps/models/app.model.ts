import { Document } from 'mongoose';

import { CategoryInterface } from '../interfaces';

export interface CategoryModel extends CategoryInterface, Document { }
