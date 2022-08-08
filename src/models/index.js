// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Profile, Media, Post } = initSchema(schema);

export {
  Profile,
  Media,
  Post
};