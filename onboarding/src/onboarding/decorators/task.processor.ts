/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SetMetadata } from '@nestjs/common';
import { TASK_PROCESSOR_METADATA } from '../constants';

export const TaskProcessor: any = (name: string) => SetMetadata(TASK_PROCESSOR_METADATA, name);
