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
schemajs        = require( 'schemajs' )
Q               = require( 'q' )
ValidationError = require( '../../errors/validation' )

module.exports =
  defineCommand: ( protocol, options ) ->

    { name, handler, route, method, schema } = options

    class Command
      @$name: name
      @$handler: handler
      @$route: route
      @$method: method
      @$schema: schema

      @hasSchema: ->
        return Command.$schema?

      @getSchema: ->
        return Command.$schema

      @getName = ->
        return Command.$name

      @getHandler = ->
        return Command.$handler

      @getRoute = ->
        return Command.$route

      @getMethod = ->
        return Command.$method

      @validate = ( payload ) ->
        if Command.$$schema?
          return Command.$$schema.validate(
            payload
          )

        localSchema = Command.getSchema( )

        if not localSchema?
          return {
            valid: true
            data: payload
            errors: [ ]
          }

        Command.$$schema = schemajs.create(
          localSchema
        )

        return Command.validate( payload )

      @toJSON = ->
        return {
          name: Command.getName( )
          route: Command.getRoute( )
          method: Command.getMethod( )
          schema: Command.getSchema( )
        }

      constructor: ( @payload ) ->
        if @ not instanceof Command
          return new Command( @payload )

        @promise = @resolve( payload )
        @promise
        .then( ( response ) =>
          @response = response
        )
        .fail( ( error ) =>
          @error = error
        )

        @then = @promise.then.bind( @promise )
        @fail = @promise.fail.bind( @promise )
        @progress = @promise.progress.bind( @promise )

      resolve: ( payload ) ->
        unless Command.hasSchema()
          res = handler.call( protocol, payload )
          return protocol._resolvePromise( res )
        return @validate( payload )

      validate: ( payload ) ->
        form = Command.validate( payload )

        unless form.valid
          return Q.reject(
            new ValidationError(
              'Payload not valid',
              form.errors
            )
          )

        res = handler.call( protocol, form.data )
        return protocol._resolvePromise( res )

      toString: ->
        return "Command [ #{ protocol.getModuleName( ) }.#{ protocol.getName( ) }##{ Command.getName( ) } ]"

      toJSON: ->
        json = Command.toJSON( )
        json.payload = @payload
        json.response = @response
        json.error = @error
        return json

    return Command