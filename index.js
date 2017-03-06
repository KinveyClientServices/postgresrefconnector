const sdk = require('kinvey-flex-sdk');
var Promise = require("bluebird");
const async = require('async');
const request = require('request'); // assumes that the request module was added to package.json

sdk.service(function(err, flex) {
    const flexFunctions = flex.functions; // gets the FlexFunctions object from the service

    function cacheOrderData(context, complete, modules) {

        console.log("***INSIDE CACHERORDERDATA***");

        const dataStore = modules.dataStore();
        const cacheCollection = dataStore.collection('ordercache');



        function getCollectionData(collectionName) {
            // if we want to just pull Active records, we can uncomment these two lines
            //const query = new modules.Query();
            //query.equalTo('Active', 'true');
            const collection = dataStore.collection(collectionName);

            return new Promise((resolve, reject) => {
                console.log(`finding ${collectionName}`);
                collection.find(null, (err, result) => {
                    if (err) {
                        return reject(err);
                    }

                    console.log(`found ${collectionName}`);

                    return resolve(result);
                });
            });
        }

        const promise = Promise.props({
            // pull both orderheader records and order detail records
            //
            orderheader: getCollectionData('orderheader'),
            orderdetail: getCollectionData('orderdetail')
        });


        promise.then((results) => {
            // create a mapping where the OrderID and OrderDeviceID are indexes into the array, for fast
            // retireval of the records when joining with the header records
            //
            const detailsMap = {};

            for (var i = 0, len = results.orderdetail.length; i < len; i++) {
                if (!detailsMap[results.orderdetail[i].OrderID + results.orderdetail[i].OrderDeviceID]) {


                    detailsMap[results.orderdetail[i].OrderID + results.orderdetail[i].OrderDeviceID] = [];
                }
                detailsMap[results.orderdetail[i].OrderID + results.orderdetail[i].OrderDeviceID].push(results.orderdetail[i]);
            }

            for (var j = 0, len = results.orderheader.length; j < len; j++) {

                if (detailsMap[results.orderheader[j].OrderID + results.orderheader[j].DeviceID]) {

                    results.orderheader[j].OrderDetails = detailsMap[results.orderheader[j].OrderID + results.orderheader[j].DeviceID];
                }
            }
            console.log(results.orderheader);
            console.log(results.orderheader.length);

            function saveme(entity, doneCallback) {
                // persist the joined records back to the ordercache collection
                //
                cacheCollection.save(entity, (err, savedResult) => {

                    if (err) {
                        console.log('******ERROR*****');
                        console.log(err);
                        return doneCallback(err);
                    } else {
                        return doneCallback();
                    }
                });

            };

            
            async.eachLimit(results.orderheader, 5, saveme, (err) => { 

                if (err) {
                    console.log('error writing');
                    console.log(err);
                    return complete().setBody(err).runtimeError().done();
                } else {
                    console.log("complete");
                    return complete().setBody().ok().done();
                }
            });
        }).catch((error) => {
            console.log('final catch');
            console.log(error);
            complete(error).runtimeError().done();
        });
    }
    flexFunctions.register('cacheOrderData', cacheOrderData);
});