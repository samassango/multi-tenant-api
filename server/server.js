// Copyright IBM Corp. 2016,2019. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

const loopback = require('loopback');
const boot = require('loopback-boot');

const app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    const baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// app.use(loopback.context());
app.use(loopback.token());
app.use(function(req, res, next){
  if(!req.accessToken){
    return next();
  }
  app.models.Tenants.findById(req.accessToken.userId, function(err, user){
     if(err){
       return next(err);
     }

     if(!user){
       return next(new Error('No user with this access token was found.'));
     }

    //console.log('server.js');
    var LoopBackContext = require('loopback-context');

    var loopbackContext = LoopBackContext.getCurrentContext();
    if(loopbackContext){
      loopbackContext.set('currentUser', user);
    }

    var models = app.models();
    const DataSource = require('loopback-datasource-juggler').DataSource;
    models.forEach(function(model) {
      model.attachTo(new DataSource({
        connector: require('loopback-connector-mongodb'),
        host: user.hostname,
        port: user.port,
        database: user.database,
        name: user.database,
        password: "",
        user: ""
      }));
    });
    next();

  });
});
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
