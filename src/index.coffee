###*
Copyright 2014 Fabian Cook
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
###
Context = require( './context' )
SQLError = require( './errors/sql' )
ValidationError = require( './errors/validation' )
ClientGeneration = require( './generation/client' )
Message = require( './message' )
MessageSchema = require( './message/schema' )
Base = require( './modules/base/base' )
Command = require( './modules/base/command' )
Module = require( './modules/base/module' )
Protocol = require( './modules/base/protocol' )
SocketClient = require( './transports/socket/client' )
SocketTransport = require( './transports/socket' )
SocketResponse = require( './transports/socket/response' )
initialize = require( './initialize' )

require( './extensions' ) # Load extension methods

module.exports =
  initialize: initialize
  # Types
  Context: Context
  SQLError: SQLError
  ValidationError: ValidationError
  ClientGeneration: ClientGeneration
  Message: Message
  MessageSchema: MessageSchema
  Base: Base
  Command: Command
  Module: Module
  Protocol: Protocol
  SocketClient: SocketClient
  SocketTransport: SocketTransport
  SocketResponse: SocketResponse