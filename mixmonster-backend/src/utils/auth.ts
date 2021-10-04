import { useGenericAuth, ResolveUserFn, ValidateUserFn } from '@envelop/generic-auth';
import { Plugin } from '@envelop/types';
import axios from 'axios';
import { UserType, Context } from '../types/basic';
import * as util from 'util'
const keycloak = require('../../keycloak.json');

const resolveUserFn: ResolveUserFn<UserType> = async context => {
  try {
    // @ts-ignore
    const token = context.req.headers.authorization;
    // @ts-ignore
    if(context.operation.name.value === 'IntrospectionQuery') return { id: 'introspection', authId: 'introspection' };
    if (!token) throw Error('No authorization provided');
    const url = `${keycloak['auth-server-url']}realms/${keycloak.realm}/protocol/openid-connect/userinfo`;
    const config = {
      headers: {
        Authorization: token,
      },
    };

    const userInfo = await axios.get(url, config);

    let dbUser = await (context as unknown as Context).db.User.findOne({ authId: userInfo.data.sub });

    if(!dbUser) {
      dbUser = await (new (context as unknown as Context).db.User({ authId: userInfo.data.sub })).save();
    }

    return { authId: userInfo.data.sub, id: dbUser.id };
  } catch (e) {
    return null;
  }
};

const validateUser: ValidateUserFn<UserType> = async (user, context) => {
  if (!user) {
    throw new Error(`Unauthenticated!`);
  }
};

const createKeycloakAuth = () : Plugin => {
  return useGenericAuth({
    resolveUserFn,
    validateUser,
    mode: 'protect-all',
  });
}

export const keycloakAuth = createKeycloakAuth()

export default createKeycloakAuth()
