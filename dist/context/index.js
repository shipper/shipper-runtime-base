
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
var Context, uuid, _;

uuid = require('node-uuid');

_ = require('lodash');

Context = (function() {
  Context.modules = {};

  Context.setModules = function(modules) {
    if (!_.isPlainObject(modules)) {
      throw new TypeError('Modules is expected to be an object');
    }
    return Context.modules = modules;
  };

  function Context() {
    this.moduleInstances = {};
    this.id = uuid.v4();
  }

  Context.prototype.setAgentType = function(type) {
    return this.agentType = type;
  };

  Context.prototype.setFacilityType = function(type) {
    return this.facilityType = type;
  };

  Context.prototype.getModule = function(moduleName) {
    var module, name;
    name = moduleName.toLowerCase();
    if (this.moduleInstances[name] != null) {
      return this.moduleInstances[name];
    }
    module = Context.modules[name];
    if ((module == null) || !(module instanceof Function)) {
      throw new Error("Unknown module: " + moduleName);
    }
    return new module(this);
  };

  Context.prototype.getModuleKeys = function() {
    return _.keys(Context.modules);
  };

  Context.prototype.getModules = function() {
    var map;
    map = {};
    _.each(this.getModuleKeys(), (function(_this) {
      return function(key) {
        return map[key] = _this.getModule(key);
      };
    })(this));
    return map;
  };

  Context.prototype.getProtocol = function(moduleName, protocolName) {
    var module;
    module = this.getModule(moduleName);
    return module.getProtocol(protocolName);
  };

  Context.prototype.setAgent = function(agent) {
    if (!(!this.agentType || agent instanceof this.agentType)) {
      throw new TypeError('Agent expected');
    }
    if ((this.agent != null) && this.agent.id !== agent.id) {
      throw new Error('Context already has an agent');
    }
    return this.agent = agent;
  };

  Context.prototype.hasAgent = function() {
    return this.agent != null;
  };

  Context.prototype.getAgent = function() {
    if (this.agent == null) {
      throw new Error('Context has no agent');
    }
    return this.agent;
  };

  Context.prototype.setFacility = function(facility) {
    if (!(!this.facilityType || facility instanceof this.facilityType)) {
      throw new TypeError('Facility expected');
    }
    return this.facility = facility;
  };

  Context.prototype.hasFacility = function() {
    return this.facility != null;
  };

  Context.prototype.getFacility = function() {
    if (this.facility == null) {
      throw new Error('Context has no facility');
    }
    return this.facility;
  };

  Context.prototype.getGroupId = function() {
    var agent;
    agent = this.getAgent();
    return agent.group_id;
  };

  Context.prototype.toJSON = function() {
    var _ref;
    return {
      id: this.id,
      agent: this.agent,
      facility_key: (_ref = this.facility) != null ? _ref.uuid : void 0
    };
  };

  return Context;

})();

module.exports = Context;
