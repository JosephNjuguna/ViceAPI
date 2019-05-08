import user from './users';

const apiPrefix = '/api/v1';
const route = (app) => {
  app.use(apiPrefix, user);
};

export default route;
