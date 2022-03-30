import { v4 as uuidv4 } from 'uuid'

import { User, Post } from './types'
// avatars
import avatar1 from './assets/avatars/giovanikososki.jpeg'
import avatar2 from './assets/avatars/icijapon.jpeg'
import avatar3 from './assets/avatars/joma.jpeg'
import avatar4 from './assets/avatars/missionjapon.jpeg'
import avatar5 from './assets/avatars/nazifbara.jpeg'
//media
import erikEastman from './assets/postmedia/erik-eastman.jpeg'
import jezaelMelgoza from './assets/postmedia/jezael-melgoza.jpeg'
import valentinBeauvais from './assets/postmedia/valentin-beauvais.jpeg'
import yoavAziz from './assets/postmedia/yoav-aziz.jpeg'
import yuKato from './assets/postmedia/yu-kato.jpeg'

export const currentUser: User = {
  id: uuidv4(),
  username: 'nazifbara',
  name: 'Nazif Barassounon',
  avatar: avatar5,
}

export const users: User[] = [
  {
    id: uuidv4(),
    username: 'icijapon',
    name: 'Tev',
    avatar: avatar2,
  },
  {
    id: uuidv4(),
    username: 'jomaoppa',
    name: 'Joma',
    avatar: avatar3,
  },
  {
    id: uuidv4(),
    username: 'missionjapon',
    name: 'Mission Japan',
    avatar: avatar4,
  },
  {
    id: uuidv4(),
    username: 'giovanikososki',
    name: 'Giovani Kososki',
    avatar: avatar1,
  },
]

export const posts: Post[] = [
  {
    id: uuidv4(),
    owner: currentUser,
    media: erikEastman,
    caption:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vel pretium lectus, ac imperdiet sapien. Donec convallis vestibulum lacus, sed sollicitudin sapien tempus sit amet. Cras bibendum ut augue vel.',
    likeCount: 12,
  },
  {
    id: uuidv4(),
    owner: users[0],
    media: jezaelMelgoza,
    caption:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vel pretium lectus, ac imperdiet sapien. Donec convallis vestibulum lacus, sed sollicitudin sapien tempus sit amet. Cras bibendum ut augue vel.',
    likeCount: 12,
  },
  {
    id: uuidv4(),
    owner: users[1],
    media: valentinBeauvais,
    caption:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vel pretium lectus, ac imperdiet sapien. Donec convallis vestibulum lacus, sed sollicitudin sapien tempus sit amet. Cras bibendum ut augue vel.',
    likeCount: 12,
  },
  {
    id: uuidv4(),
    owner: users[2],
    media: yoavAziz,
    caption:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vel pretium lectus, ac imperdiet sapien. Donec convallis vestibulum lacus, sed sollicitudin sapien tempus sit amet. Cras bibendum ut augue vel.',
    likeCount: 12,
  },
  {
    id: uuidv4(),
    owner: users[3],
    media: yuKato,
    caption:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vel pretium lectus, ac imperdiet sapien. Donec convallis vestibulum lacus, sed sollicitudin sapien tempus sit amet. Cras bibendum ut augue vel.',
    likeCount: 12,
  },
]
