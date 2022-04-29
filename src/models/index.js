// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Post, Media } = initSchema(schema);

export {
  Post,
  Media
};