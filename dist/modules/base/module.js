
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
var Base, BaseModule, Q, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Base = require('./base');

_ = require('lodash');

Q = require('q');

BaseModule = (function(_super) {
  __extends(BaseModule, _super);

  function BaseModule(context, name) {
    BaseModule.__super__.constructor.call(this, context, name);
    this.protocols = {};
  }

  BaseModule.prototype.registerProtocol = function(protocol) {
    var name;
    if (!this.isBase(protocol)) {
      throw new Error('Registered protocol not instance of BaseProtocol');
    }
    name = protocol.getName();
    if (this.protocols[name] != null) {
      throw new Error("Protocol " + name + " already registered with " + (this.getName()));
    }
    if (protocol.hasModule()) {
      throw new Error("Protocol " + name + " already registered with module " + (protocol.getModuleName()));
    }
    protocol.setModule(this);
    return this.protocols[name] = protocol;
  };

  BaseModule.prototype.handleMessage = function(message) {
    var protocol;
    protocol = this.getProtocol(message.protocol);
    if (!protocol) {
      return Q.reject("Unknown protocol: " + message.protocol);
    }
    return protocol.handleMessage(message);
  };

  BaseModule.prototype.getProtocol = function(protocolName) {
    var name, protocol;
    name = protocolName.toLowerCase();
    protocol = this.protocols[name];
    if (protocol == null) {
      throw new Error("Unknown protocol: " + protocolName);
    }
    return protocol;
  };

  BaseModule.prototype.getProtocolKeys = function() {
    return _.keys(this.protocols);
  };

  BaseModule.prototype.getProtocols = function() {
    var map;
    map = {};
    _.each(this.getProtocolKeys(), (function(_this) {
      return function(key) {
        return map[key] = _this.getProtocol(key);
      };
    })(this));
    return map;
  };

  return BaseModule;

})(Base);

module.exports = BaseModule;
