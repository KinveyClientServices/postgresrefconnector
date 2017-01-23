# Kinvey Datalink Errors

Create Kinvey-formatted errors for Datalinks

## Installation

```
npm install kinvey-datalink-errors
```

## Usage

Kinvey Errors exposes a single function, `generateKinveyError` which takes the error type and an error.  The error can
either be a string or a JavaScript `Error`.

```
var kinveyErrors = require('kinvey-datalink-errors');

var myError = kinveyErrors.generateKinveyError("NotFound", "The record is not found"); // a string
var myError = kinveyErrors.generateKinveyError("NotFound, new Error("The record is not found")); // an error
```

The library returns the error passed as a Kinvey-formatted error.

```
{
  error: "NotFound",
  description: "The requested entity or entites were not found in the collection."
  debug: "THe record is not found"
  statusCode: 404
}
```

If an error object is passed and it contains a stack trace, the stack trace will also be included in the error object.

## Error Types

This library exposes the following error types:


| Error Type    | Description  |
|-------------|-------------|
|NotFound      | Used when an entity is not found.  Note:  This should only be used on getById and deleteById commands.  Otherwise, an empty array should be returned (for getAll, getByQuery) or a count of 0 (for deleteByQuery, countByQuery).|
| BadRequest    | Used for any invalid input - queries, body, etc. |
| Unauthorized  | Used when the operation or user is unauthorized to perform the operation.  |
| Forbidden     | Used when an operation is forbidden. |
| NotAllowed    | Used when the request is not allowed |
| NotImplemented | Used when a specific method is not implemented |
| RuntimeError | Used for any type of runtime error |
