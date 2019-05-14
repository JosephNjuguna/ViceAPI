import user from './users';
import loans from './loans';
import payments from './payments';

const apiPrefix = '/api/v1';
const route = (app) => {
  app.use(apiPrefix, user);
  app.use(apiPrefix, loans);
  app.use(apiPrefix, payments);
};

export default route;
