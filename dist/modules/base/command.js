
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
var Q, ValidationError, schemajs;

schemajs = require('schemajs');

Q = require('q');

ValidationError = require('../../errors/validation');

module.exports = {
  defineCommand: function(protocol, options) {
    var Command, handler, method, name, route, schema;
    name = options.name, handler = options.handler, route = options.route, method = options.method, schema = options.schema;
    Command = (function() {
      Command.$name = name;

      Command.$handler = handler;

      Command.$route = route;

      Command.$method = method;

      Command.$schema = schema;

      Command.hasSchema = function() {
        return Command.$schema != null;
      };

      Command.getSchema = function() {
        return Command.$schema;
      };

      Command.getName = function() {
        return Command.$name;
      };

      Command.getHandler = function() {
        return Command.$handler;
      };

      Command.getRoute = function() {
        return Command.$route;
      };

      Command.getMethod = function() {
        return Command.$method;
      };

      Command.validate = function(payload) {
        var localSchema;
        if (Command.$$schema != null) {
          return Command.$$schema.validate(payload);
        }
        localSchema = Command.getSchema();
        if (localSchema == null) {
          return {
            valid: true,
            data: payload,
            errors: []
          };
        }
        Command.$$schema = schemajs.create(localSchema);
        return Command.validate(payload);
      };

      Command.toJSON = function() {
        return {
          name: Command.getName(),
          route: Command.getRoute(),
          method: Command.getMethod(),
          schema: Command.getSchema()
        };
      };

      function Command(payload) {
        this.payload = payload;
        if (!(this instanceof Command)) {
          return new Command(this.payload);
        }
        this.promise = this.resolve(payload);
        this.promise.then((function(_this) {
          return function(response) {
            return _this.response = response;
          };
        })(this)).fail((function(_this) {
          return function(error) {
            return _this.error = error;
          };
        })(this));
        this.then = this.promise.then.bind(this.promise);
        this.fail = this.promise.fail.bind(this.promise);
        this.progress = this.promise.progress.bind(this.promise);
      }

      Command.prototype.resolve = function(payload) {
        var res;
        if (!Command.hasSchema()) {
          res = handler.call(protocol, payload);
          return protocol._resolvePromise(res);
        }
        return this.validate(payload);
      };

      Command.prototype.validate = function(payload) {
        var form, res;
        form = Command.validate(payload);
        if (!form.valid) {
          return Q.reject(new ValidationError('Payload not valid', form.errors));
        }
        res = handler.call(protocol, form.data);
        return protocol._resolvePromise(res);
      };

      Command.prototype.toString = function() {
        return "Command [ " + (protocol.getModuleName()) + "." + (protocol.getName()) + "#" + (Command.getName()) + " ]";
      };

      Command.prototype.toJSON = function() {
        var json;
        json = Command.toJSON();
        json.payload = this.payload;
        json.response = this.response;
        json.error = this.error;
        return json;
      };

      return Command;

    })();
    return Command;
  }
};
