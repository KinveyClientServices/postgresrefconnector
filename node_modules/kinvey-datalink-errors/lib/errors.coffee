# Copyright (c) 2016 Kinvey Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
# in compliance with the License. You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed under the License
# is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
# or implied. See the License for the specific language governing permissions and limitations under
# the License.

util = require 'util'

errTypes =
  NotFound:
    error:  "NotFound"
    description: "The requested entity or entites were not found in the collection"
    statusCode: 404
  BadRequest:
    error: "BadRequest"
    description: "Unable to understand the request"
    statusCode: 400
  Unauthorized:
    error: "InvalidCredentials"
    description: "Invalid credentials.  Please retry your request with correct credentials."
    statusCode: 401
  Forbidden:
    error: "Forbidden"
    description: "The request is forbidden"
    statusCode: 403
  NotAllowed:
    error: "NotAllowed"
    description: "The request is not allowed"
    statusCode: 405
  NotImplemented:
    error: "NotImplemented"
    description: "The request invoked a method that is not implemented"
    statusCode: 501
  RuntimeError:
    error: "DataLinkRuntimeError"
    description: "The datalink had a runtime error.  See debug message for details"
    statusCode: 550
  default:
    error: "DataLinkInternalError"
    description: "The DataLink request experienced a problem. See debug message for details."
    statusCode: 550

KinveyError = (message) ->
  Error.call this
  @message = message

util.inherits KinveyError, Error

exports.generateKinveyError = (type, err) ->
  error = errTypes[type] or errTypes["default"]

  kinveyError = new KinveyError error.error
  kinveyError.description = error.description
  kinveyError.statusCode = error.statusCode

  if err instanceof Error
    kinveyError.debug = err?.debug or err?.message or err?.name or err?.toString() or {}
    if err?.stack?
      kinveyError.stack = err.stack
  else
    kinveyError.debug = err or {}

  return kinveyError




