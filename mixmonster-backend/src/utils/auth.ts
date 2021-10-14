import { useGenericAuth, ResolveUserFn, ValidateUserFn } from '@envelop/generic-auth';
import { Plugin } from '@envelop/types';
import axios from 'axios';
import { UserType } from '../types/basic';

const keycloak = require('../../keycloak.json');

const resolveUserFn: ResolveUserFn<UserType> = async context => {
  try {
    // @ts-ignore
    const token = context.req.headers.authorization;
    // @ts-ignore
    if(context.operation.name?.value === 'IntrospectionQuery') return { id: 'introspection', authId: 'introspection' };
    if (!token) return null;

    const url = `${keycloak['auth-server-url']}realms/${keycloak.realm}/protocol/openid-connect/userinfo`;
    const config = {
      headers: {
        Authorization: token,
      },
    };

    const userInfo = await axios.get(url, config);
    console.log(userInfo.data);

    return { id: userInfo.data.sub };
  } catch (e) {
    return null;
  }
};

const validateUser: ValidateUserFn<UserType> = async (user, context) => {
  console.log(user);
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
