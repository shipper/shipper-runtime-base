
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
var Context, _;

Context = require('../context');

_ = require('lodash');

module.exports = function() {
  var context, res, typeMap;
  context = new Context();
  res = {};
  typeMap = {};
  _.each(context.getModules(), function(mod) {
    var protocolsMap;
    protocolsMap = {};
    _.each(mod.getProtocols(), function(protocol) {
      var commandMap;
      commandMap = {};
      _.each(protocol.getCommands(), function(command) {
        return commandMap[command.getName()] = command;
      });
      _.each(protocol.getTypes(), function(type) {
        if (typeMap.hasOwnProperty(type.name) && typeMap[type.name] !== type.type) {
          throw new Error("Duplicate type: " + type.name);
        }
        return typeMap[type.name] = type.type;
      });
      return protocolsMap[protocol.getName()] = commandMap;
    });
    return res[mod.getName()] = protocolsMap;
  });
  return {
    modules: res,
    types: typeMap
  };
};
