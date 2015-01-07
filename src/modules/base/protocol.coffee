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
Base     = require( './base' )
Q        = require( 'q' )
schemajs = require( 'schemajs' )
_        = require( 'lodash' )
command  = require( './command' )

class BaseProtocol extends Base

  constructor: ( context, name ) ->
    super( context, name )
    @commandSchemas = { }
    @commands = { }
    @schema = undefined
    @types = { }

  _resolvePromise: ( possiblePromise ) ->
    unless possiblePromise?
      return Q.resolve( )

    if (
      possiblePromise.then instanceof Function and
      possiblePromise.fail not instanceof Function and
      possiblePromise.catch instanceof Function
    )
      possiblePromise.fail = possiblePromise.catch

    if (
      possiblePromise.then instanceof Function and
      possiblePromise.fail instanceof Function
    )
      unless possiblePromise.progress not instanceof Function
        return possiblePromise
      deferred = Q.defer()
      possiblePromise
      .then(
        deferred.resolve
      )
      .fail(
        deferred.reject
      )
      if possiblePromise.progress instanceof Function
        possiblePromise.progress(
          deferred.notify
        )
      return deferred.promise

    return Q.resolve( possiblePromise )

  type: ( options ) ->
    @types[ options.name.toLowerCase( ) ] = options

  getType: ( name ) ->
    type = @types[ name.toLowerCase() ]
    unless type
      throw new Error( "Unknown type: #{ name }" )
    return type

  getTypeNames: ->
    return _.keys(
      @types
    )

  getTypes: ->
    map = { }
    _.each( @getTypeNames( ), ( name ) =>
      return map[ name ] = @getType( name )
    )
    return map

  command: ( options ) ->

    handler = command.defineCommand( @, options )

    @commands[ options.name.toLowerCase( ) ] = handler

    if @[ options.name ] is options.handler
      @[ options.name ] = handler
    else
      for key, val of @
        unless val is options.handler
          continue
        @[ key ] = handler
        break

  setModule: ( @module ) ->

  hasModule: ->
    return @module?

  getModule: ->
    unless @hasModule( )
      throw new Error( "Protocol #{ @getName( ) } has no module" )
    return @module

  getModuleName: ->
    module = @getModule( )
    return module.getName( )

  getCommand: ( commandName ) ->
    name = commandName.toLowerCase( )
    handler = @commands[ name ]
    unless handler instanceof Function
      throw new Error(
        "Unknown command: #{ commandName }"
      )
    return handler

  getCommandNames: ->
    return _.keys(
      @commands
    )

  getCommands: ->
    map = { }
    _.each( @getCommandNames( ), ( name ) =>
      map[ name ] = @getCommand( name )
    )
    return map

  handleMessage: ( message ) ->
    handler = message.getCommand( )
    return handler( message.payload )

module.exports = BaseProtocol