
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
var SQLError,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SQLError = (function(_super) {
  __extends(SQLError, _super);

  function SQLError(originalError) {
    this.originalError = originalError != null ? originalError : {};
    SQLError.__super__.constructor.call(this, this.originalError.message);
    this.message = this.originalError.message;
    this.stack = this.originalError.stack;
  }

  SQLError.prototype.toString = function() {
    return "SQLError: " + this.message;
  };

  return SQLError;

})(Error);

module.exports = SQLError;
