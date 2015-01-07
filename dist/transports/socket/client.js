
/**
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
 */
var Context, Message, Response, SocketClient;

Message = require('../../message');

Context = require('../../context');

Response = require('./response');

SocketClient = (function() {
  function SocketClient(transport, request) {
    this.transport = transport;
    this.request = request;
    this.connection = request.accept('shipper', request.origin);
    this.connected = true;
    this.context = new Context();
    this.connection.on('message', this.onMessage.bind(this));
    this.connection.on('close', (function(_this) {
      return function() {
        return _this.connected = false;
      };
    })(this));
  }

  SocketClient.prototype.onMessage = function(message) {
    try {
      if (message.type === 'utf8') {
        return this.handleText(message.utf8Data);
      }
      if (message.type === 'binary') {
        return this.handleBinary(message.binaryData);
      }
    } catch (_error) {}
  };

  SocketClient.prototype.handleText = function(text) {
    var json, message;
    try {
      json = void 0;
      try {
        json = JSON.parse(text);
      } catch (_error) {}
      if (json == null) {
        return;
      }
      message = new Message(this.context, json);
      return this.handleMessage(message);
    } catch (_error) {}
  };

  SocketClient.prototype.handleBinary = function(binary) {
    var text;
    try {
      text = binary.toString();
      return this.handleText(text);
    } catch (_error) {}
  };

  SocketClient.prototype.handleMessage = function(message) {
    try {
      return message.handle().progress(function(payload) {
        var response;
        response = new Response(payload, message, true);
        return this.send(response);
      }).then((function(_this) {
        return function(payload) {
          var response;
          response = new Response(payload, message);
          return _this.send(response);
        };
      })(this)).fail((function(_this) {
        return function(error) {
          var response;
          response = new Response(void 0, message, false, error);
          return _this.send(response);
        };
      })(this));
    } catch (_error) {}
  };

  SocketClient.prototype.send = function(data) {
    var message;
    if (!this.connected) {
      throw new Error('Socket not connected');
    }
    message = data;
    if (typeof data !== 'string') {
      message = JSON.stringify(data);
    }
    return this.connection.sendUTF(message);
  };

  return SocketClient;

})();

module.exports = SocketClient;
