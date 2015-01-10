
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
var Message, ValidationError, schema, _;

schema = require('./schema');

ValidationError = require('../errors/validation');

_ = require('lodash');

Message = (function() {
  function Message(context, data) {
    var form;
    this.context = context;
    form = schema.validate(data);
    if (!form.valid) {
      throw new ValidationError('Message not valid', form.errors);
    }
    data = form.data;
    _.assign(this, data);
  }

  Message.prototype.getModuleName = function() {
    return this.module;
  };

  Message.prototype.getProtocolName = function() {
    return this.protocol;
  };

  Message.prototype.getCommandName = function() {
    return this.command;
  };

  Message.prototype.getModule = function() {
    return this.context.getModule(this.getModuleName());
  };

  Message.prototype.getProtocol = function() {
    return this.context.getProtocol(this.getModuleName(), this.getProtocolName());
  };

  Message.prototype.getCommand = function() {
    var protocol;
    protocol = this.getProtocol();
    return protocol.getCommand(this.getCommandName());
  };

  Message.prototype.getPayload = function() {
    var parse;
    if (this._payload) {
      return this._payload;
    }
    this._payload = {};
    parse = function(obj) {
      var index, k, kv, res, v, _i, _len;
      if (!(obj instanceof Object)) {
        return obj;
      }
      kv = function(key, value) {
        value = parse(v);
        if (!(value instanceof Object)) {
          return value;
        }
        if (!((value.type != null) && (value.value != null))) {
          return value;
        }
        if (value.type === 'date') {
          value = new Date(value.value);
        }
        return value;
      };
      res = void 0;
      if (obj instanceof Array) {
        res = [];
        for (index = _i = 0, _len = obj.length; _i < _len; index = ++_i) {
          v = obj[index];
          res.push(kv(index, v));
        }
        return res;
      } else {
        res = {};
        for (k in obj) {
          v = obj[k];
          if (!obj.hasOwnProperty(k)) {
            continue;
          }
          res[k] = kv(k, v);
        }
      }
      return res;
    };
    return this._payload = parse(this.payload);
  };

  Message.prototype.handle = function() {
    var protocol;
    protocol = this.getProtocol();
    return protocol.handleMessage(this);
  };

  Message.prototype.toJSON = function() {
    return {
      protocol: this.protocol,
      command: this.command,
      payload: this.payload
    };
  };

  return Message;

})();

module.exports = Message;
