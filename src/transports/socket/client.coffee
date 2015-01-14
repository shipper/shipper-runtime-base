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
Message  = require( '../../message' )
Context  = require( '../../context' )
Response = require( './response' )

class SocketClient

  constructor: ( @transport, @request ) ->

    @connection = request.accept( 'shipper', request.origin )

    @connected = yes

    @context = new Context( )

    if @transport.capabilities?
      @send({
        module: 'default'
        protocol: 'default'
        command: 'capabilities'
        payload: capabilities
      })

    @connection.on( 'message', @onMessage.bind( @ ) )

    @connection.on( 'close', =>
      @connected = no
    )

  onMessage: ( message ) ->
    try
      if message.type is 'utf8'
        return @handleText(
          message.utf8Data
        )
      if message.type is 'binary'
        return @handleBinary(
          message.binaryData
        )

  handleText: ( text ) ->
    try
      json = undefined
      try
        json = JSON.parse( text )

      if not json?
        return

      message = new Message( @context, json )

      @handleMessage( message )

  handleBinary: ( binary ) ->
    try
      # TODO handle binary files
      text = binary.toString( )
      @handleText( text )

  handleMessage: ( message ) ->
    try
      message.handle( )
      .progress( ( payload ) ->
        response = new Response(
          payload,
          message,
          yes
        )
        @send( response )
      )
      .then( ( payload ) =>
        response = new Response(
          payload,
          message
        )
        @send( response )
      )
      .fail( ( error ) =>
        response = new Response(
          undefined,
          message,
          no,
          error
        )
        @send( response )
      )

  send: ( data ) ->
    unless @connected
      throw new Error(
        'Socket not connected'
      )
    message = data
    unless typeof data is 'string'
      message = JSON.stringify(
        data
      )
    @connection.sendUTF(
      message
    )










module.exports = SocketClient