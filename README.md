# Pulling Order Header and Order Detail Records from MSSQL and Persisting to Kinvey

## This reference shows a low code mechanism to query against an MSSQL database
###### It leverages the two RAPID connectors in the Kinvey backend named orderheader and orderdetails
Those collections are backed by our RAPID MSSQL Connectors.  Our Flex SDK allows you to invoke our RAPID MSSQL connector.

Once the records are pulled, we're doing a join in this service based on OrderID and DeviceID and writing that back to the ordercache collection.  You'll note that the ordercache collection is backed by Kinvey, so it's just writing it to the collection in the noSQL database.

