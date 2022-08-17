// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Profile, Post, Media } = initSchema(schema);

export {
  Profile,
  Post,
  Media
};