import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory: GraphQLDefinitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  path: join(process.cwd(), 'src/products/graphql/graphql.schema.ts'),
  typePaths: ['./**/*.graphql'],
}).catch();
