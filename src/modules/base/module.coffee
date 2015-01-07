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
Base = require( './base' )
_    = require( 'lodash' )
Q    = require( 'q' )

class BaseModule extends Base
  constructor: ( context, name ) ->
    super( context, name )
    @protocols = { }

  registerProtocol: ( protocol ) ->
    unless @isBase( protocol )
      throw new Error( 'Registered protocol not instance of BaseProtocol' )
    name = protocol.getName( )
    if @protocols[ name ]?
      throw new Error( "Protocol #{ name } already registered with #{ @getName( ) }" )

    if protocol.hasModule( )
      throw new Error(
        "Protocol #{ name } already registered with module #{ protocol.getModuleName( ) }"
      )

    protocol.setModule( @ )

    @protocols[ name ] = protocol

  handleMessage: ( message ) ->
    protocol = @getProtocol( message.protocol )
    unless protocol
      return Q.reject( "Unknown protocol: #{ message.protocol }" )
    return protocol.handleMessage(
      message
    )

  getProtocol: ( protocolName ) ->
    name = protocolName.toLowerCase( )
    protocol = @protocols[ name ]
    if not protocol?
      throw new Error(
        "Unknown protocol: #{ protocolName }"
      )
    return protocol

  getProtocolKeys: ->
    return _.keys(
      @protocols
    )

  getProtocols: ->
    map = { }
    _.each( @getProtocolKeys( ), ( key ) =>
      map[ key ] = @getProtocol( key )
    )
    return map

module.exports = BaseModule