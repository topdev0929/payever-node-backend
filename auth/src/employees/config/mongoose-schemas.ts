import { ModelDefinition } from '@nestjs/mongoose';
import { 
  EmployeeActivityHistorySchema, 
  EmployeeActivityHistorySchemaName, 
  EmployeeSchema, 
  EmployeeSchemaName, 
  EmployeeSettingSchema, 
  EmployeeSettingSchemaName, 
  GroupsSchema, 
  GroupsSchemaName, 
} from '../schemas';

export const MongooseSchemas: ModelDefinition[] = [
  {
    name: EmployeeSchemaName,
    schema: EmployeeSchema,
  },
  {
    name: EmployeeActivityHistorySchemaName,
    schema: EmployeeActivityHistorySchema,
  },
  {
    name: GroupsSchemaName,
    schema: GroupsSchema,
  },
  {
    name: EmployeeSettingSchemaName,
    schema: EmployeeSettingSchema,
  },
];
