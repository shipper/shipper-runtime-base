
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
var Base, BaseProtocol, Q, command, schemajs, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./base');

Q = require('q');

schemajs = require('schemajs');

_ = require('lodash');

command = require('./command');

BaseProtocol = (function(_super) {
  __extends(BaseProtocol, _super);

  function BaseProtocol(context, name) {
    BaseProtocol.__super__.constructor.call(this, context, name);
    this.commandSchemas = {};
    this.commands = {};
    this.schema = void 0;
    this.types = {};
  }

  BaseProtocol.prototype._resolvePromise = function(possiblePromise) {
    var deferred;
    if (possiblePromise == null) {
      return Q.resolve();
    }
    if (possiblePromise.then instanceof Function && !(possiblePromise.fail instanceof Function) && possiblePromise["catch"] instanceof Function) {
      possiblePromise.fail = possiblePromise["catch"];
    }
    if (possiblePromise.then instanceof Function && possiblePromise.fail instanceof Function) {
      if (possiblePromise.progress instanceof Function) {
        return possiblePromise;
      }
      deferred = Q.defer();
      possiblePromise.then(deferred.resolve).fail(deferred.reject);
      if (possiblePromise.progress instanceof Function) {
        possiblePromise.progress(deferred.notify);
      }
      return deferred.promise;
    }
    return Q.resolve(possiblePromise);
  };

  BaseProtocol.prototype.type = function(options) {
    return this.types[options.name.toLowerCase()] = options;
  };

  BaseProtocol.prototype.getType = function(name) {
    var type;
    type = this.types[name.toLowerCase()];
    if (!type) {
      throw new Error("Unknown type: " + name);
    }
    return type;
  };

  BaseProtocol.prototype.getTypeNames = function() {
    return _.keys(this.types);
  };

  BaseProtocol.prototype.getTypes = function() {
    var map;
    map = {};
    _.each(this.getTypeNames(), (function(_this) {
      return function(name) {
        return map[name] = _this.getType(name);
      };
    })(this));
    return map;
  };

  BaseProtocol.prototype.command = function(options) {
    var handler, key, val, _results;
    handler = command.defineCommand(this, options);
    this.commands[options.name.toLowerCase()] = handler;
    if (this[options.name] === options.handler) {
      return this[options.name] = handler;
    } else {
      _results = [];
      for (key in this) {
        val = this[key];
        if (val !== options.handler) {
          continue;
        }
        this[key] = handler;
        break;
      }
      return _results;
    }
  };

  BaseProtocol.prototype.setModule = function(module) {
    this.module = module;
  };

  BaseProtocol.prototype.hasModule = function() {
    return this.module != null;
  };

  BaseProtocol.prototype.getModule = function() {
    if (!this.hasModule()) {
      throw new Error("Protocol " + (this.getName()) + " has no module");
    }
    return this.module;
  };

  BaseProtocol.prototype.getModuleName = function() {
    var module;
    module = this.getModule();
    return module.getName();
  };

  BaseProtocol.prototype.getCommand = function(commandName) {
    var handler, name;
    name = commandName.toLowerCase();
    handler = this.commands[name];
    if (!(handler instanceof Function)) {
      throw new Error("Unknown command: " + commandName);
    }
    return handler;
  };

  BaseProtocol.prototype.getCommandNames = function() {
    return _.keys(this.commands);
  };

  BaseProtocol.prototype.getCommands = function() {
    var map;
    map = {};
    _.each(this.getCommandNames(), (function(_this) {
      return function(name) {
        return map[name] = _this.getCommand(name);
      };
    })(this));
    return map;
  };

  BaseProtocol.prototype.handleMessage = function(message) {
    var handler;
    handler = message.getCommand();
    return handler(message.payload);
  };

  return BaseProtocol;

})(Base);

module.exports = BaseProtocol;
