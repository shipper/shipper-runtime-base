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
schema          = require( './schema' )
ValidationError = require( '../errors/validation' )
_               = require( 'lodash' )

class Message
  constructor: ( @context, data ) ->
    form = schema.validate( data )
    if not form.valid
      throw new ValidationError( 'Message not valid', form.errors )
    { data } = form
    _.assign( @, data )

  getModuleName: ->
    return @module

  getProtocolName: ->
    return @protocol

  getCommandName: ->
    return @command

  getModule: ->
    return @context.getModule(
      @getModuleName( )
    )

  getProtocol: ->
    return @context.getProtocol(
      @getModuleName( ),
      @getProtocolName( )
    )

  getCommand: ->
    protocol = @getProtocol( )
    return protocol.getCommand(
      @getCommandName( )
    )

  getPayload: ->
    if @_payload
      return @_payload
    @_payload = { }

    parse = ( obj ) ->

      unless obj instanceof Object
        return obj

      kv = ( key, value ) ->
        value = parse( v )
        unless value instanceof Object
          return value
        unless (
          value.type? and
          value.value?
        )
          return value
        if value.type is 'date'
          value = new Date( value.value )
        return value

      res = undefined
      if obj instanceof Array
        res = [ ]
        for v, index in obj
          res.push( kv( index, v ) )
        return res
      else
        res = { }
        for k, v of obj
          unless obj.hasOwnProperty( k )
            continue
          res[ k ] = kv( k, v )
      return res

    return @_payload = parse( @payload )

  handle: ->
    protocol = @getProtocol( )
    return protocol.handleMessage(
      @
    )

  toJSON: ->
    return {
      protocol: @protocol
      command: @command
      payload: @payload
    }

module.exports = Message