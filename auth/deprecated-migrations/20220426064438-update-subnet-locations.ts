import {
  Db,
  MongoClient,
} from 'mongodb';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';


interface LocationInterface extends Document {
  userId: string;
  userAgent: string;
  subnet?: string;
  subnets?: string[];
  hashedSubnets?: string[];
  hashedSubnet?: string;
  createdAt?: Date;
  name: string;
  verified: boolean;
}


async function up ( db: any ): Promise<void> {
  const client: MongoClient = new MongoClient( db.connectionString );
  await client.connect();
  const connectDB: Db = client.db();

  const locations: LocationInterface[] = await connectDB.collection( 'locations' ).find( { } ).toArray();

  if ( locations && locations.length > 0 ) {

    for ( const location of locations ) {

      if ( location.hashedSubnets === undefined
        || location.subnets === undefined ) {
        continue;
      }

      for ( let i: number = 0; i < location.hashedSubnets.length; i++ ) {
        const newLocation: LocationInterface = Object.assign( { }, location );
        newLocation._id = uuid();

        newLocation.hashedSubnet = location.hashedSubnets[ i ];
        delete newLocation.hashedSubnets;

        newLocation.subnet = location.subnets[ i ];
        delete newLocation.subnets;

        await connectDB.collection( 'locations' ).insertOne( newLocation );
      }

      await connectDB.collection( 'locations' ).deleteOne( { '_id': location._id } );
    }

  }

  await client.close();

  return null;
}

function down (): Promise<void> {
  return null;
}

module.exports.up = up;
module.exports.down = down;
