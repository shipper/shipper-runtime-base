
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
var Base;

Base = (function() {
  function Base(context, name) {
    this.context = context;
    this.name = name.toLowerCase();
  }

  Base.prototype.getContext = function() {
    return this.context;
  };

  Base.prototype.getName = function() {
    return this.name;
  };

  Base.prototype.isBase = function(object) {
    return object instanceof Base;
  };

  return Base;

})();

module.exports = Base;
