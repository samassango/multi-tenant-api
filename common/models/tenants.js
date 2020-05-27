'use strict';


module.exports = function (Tenants) {

    // function createDatasource(DBNAME, PASSWORD, USER, HOSTNAME, PORT) {
    //     var DataSource = require('loopback-datasource-juggler').DataSource;

    //     var dataSource = new DataSource({
    //         connector: require('loopback-connector-mongodb'),
    //         host: HOSTNAME,
    //         port: PORT,
    //         database: DBNAME,
    //         password: PASSWORD,
    //         user: USER
    //     });
    //     return dataSource;
    // }

    Tenants.afterRemote('login', function (ctx, tenantInstance, next) {
        // console.log("tenantInstance", tenantInstance);
        const result = ctx.result;
        // console.log(ctx);
        Tenants.find({
            where: {
                id: tenantInstance.userId
            }
        }, function (err, tenant) {
            if (err) console.log(err)
            const data = tenant[0];

          //  const ds = createDatasource(data.database, data.password, data.user, data.hostname, data.port);
             //app.models.YourModel.attachTo(app.dataSources.mysql);
            // ... or ...
            // app.models.YourModel.attachTo(app.dataSources.postgresql);
        });

        next();
    })
};
