import { useGenericAuth, ResolveUserFn, ValidateUserFn } from '@envelop/generic-auth';
import { Plugin } from '@envelop/types';
import axios from 'axios';
import { UserType } from '../types/basic';

const keycloak = require('../../keycloak.json');

const resolveUserFn: ResolveUserFn<UserType> = async context => {
  try {
    // @ts-ignore
    const token = context.req.headers.authorization;
    if (!token) return null;

    const url = `${keycloak['auth-server-url']}realms/${keycloak.realm}/protocol/openid-connect/userinfo`;
    const config = {
      headers: {
        Authorization: token,
      },
    };

    const userInfo = await axios.get(url, config);

    return { id: userInfo.data.sub };
  } catch (e) {
    return null;
  }
};

const validateUser: ValidateUserFn<UserType> = async (user, context) => {
  if (!user
    // @ts-ignore
    && context.operation.name?.value !== 'IntrospectionQuery'
    // @ts-ignore
    && context.operation.name?.value !== 'getCollection') {
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
