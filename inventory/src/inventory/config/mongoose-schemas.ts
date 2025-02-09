import { 
  InventorySchemaName, 
  OrderSchemaName, 
  ReservationSchemaName, 
  InventoryLocationSchemaName, 
  LocationSchemaName,
} from '../../environments/mongoose-schema.names';
import { 
  InventorySchema, 
  OrderSchema, 
  ReservationSchema, 
  InventoryLocationSchema, 
  LocationSchema,
} from '../schemas';

export const MongooseSchemas: any = [
  {
    name: InventorySchemaName,
    schema: InventorySchema,
  },
  {
    name: OrderSchemaName,
    schema: OrderSchema,
  },
  {
    name: ReservationSchemaName,
    schema: ReservationSchema,
  },
  {
    name: InventoryLocationSchemaName,
    schema: InventoryLocationSchema,
  },
  {
    name: LocationSchemaName,
    schema: LocationSchema,
  },
];
