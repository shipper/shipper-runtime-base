
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
var ValidationError,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

ValidationError = (function(_super) {
  __extends(ValidationError, _super);

  function ValidationError(message, errors) {
    this.message = message;
    this.errors = errors != null ? errors : void 0;
    ValidationError.__super__.constructor.call(this, message);
  }

  ValidationError.prototype.toString = function() {
    var k, res, v, _ref;
    res = "ValidationError: " + this.message;
    if (!this.errors) {
      return res;
    }
    _ref = this.errors;
    for (k in _ref) {
      v = _ref[k];
      if (!this.errors.hasOwnProperty(k)) {
        continue;
      }
      res += "\n\tError: " + v;
    }
    return res;
  };

  return ValidationError;

})(Error);

module.exports = ValidationError;
