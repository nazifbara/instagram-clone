import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type PostMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MediaMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Post {
  readonly id: string;
  readonly caption?: string | null;
  readonly Media?: Media[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Post, PostMetaData>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post, PostMetaData>) => MutableModel<Post, PostMetaData> | void): Post;
}

export declare class Media {
  readonly id: string;
  readonly mediaKey: string;
  readonly postID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Media, MediaMetaData>);
  static copyOf(source: Media, mutator: (draft: MutableModel<Media, MediaMetaData>) => MutableModel<Media, MediaMetaData> | void): Media;
}