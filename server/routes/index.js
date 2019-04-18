import user from './users';
import loans from  './loan';

const apiPrefix = '/api/v2';

const route = (app) => {
  app.use(apiPrefix, user);
  app.use(apiPrefix, loans);
};

export default route;
