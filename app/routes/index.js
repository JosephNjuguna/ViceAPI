const user =  require('./users');
const apiPrefix = '/api/v1';

const route = (app) => {
  app.use(apiPrefix, user);
};

module.exports= route;
