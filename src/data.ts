import { v4 as uuidv4 } from 'uuid'

import { User } from './types'
import avatar1 from './assets/avatars/giovanikososki.jpeg'
import avatar2 from './assets/avatars/icijapon.jpeg'
import avatar3 from './assets/avatars/joma.jpeg'
import avatar4 from './assets/avatars/missionjapon.jpeg'

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
