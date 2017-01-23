/*
TO DO:  Populate the *** fields with the appropriate values for your postgres db
*/
const sdk = require('kinvey-flex-sdk');
var pg = require('pg');

function listHandler(req, complete, modules) {
    console.log('****inside listhandler****');

    var client = new pg.Client({
        user: "***",
        password: "***",
        database: "***",
        port: 5432,
        host: "***",
        ssl: true
    });

    // connect to our database
    client.connect(function(err) {
        if (err) throw err;

        // execute a query on our database
        //client.query('SELECT $1::text as name', ['brianc'], function (err, result) {
        client.query('SELECT * from accounts', function(err, result) {
            if (err) throw err;

            // just print the result to the console
            console.log(result.rows); // outputs: { name: 'brianc' }

            // disconnect the client
            client.end(function(err) {
                if (err) throw err;

            });
            complete(result.rows).ok().next();
        });
    });

}


sdk.service(function(err, flex) {
    const data = flex.data;

    //var dataLink = service.dataLink; // gets the datalink object from the service
    var postgres = data.serviceObject('Doctors');
    postgres.onGetAll(listHandler);
});