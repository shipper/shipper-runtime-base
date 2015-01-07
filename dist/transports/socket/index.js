
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
var Client, SocketTransport;

Client = require('./client');

SocketTransport = (function() {
  function SocketTransport(wsServer) {
    this.wsServer = wsServer;
    wsServer.on('request', (function(_this) {
      return function(request) {
        return new Client(_this, request);
      };
    })(this));
  }

  return SocketTransport;

})();

module.exports = SocketTransport;
