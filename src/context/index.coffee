###*
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
###
uuid      = require( 'node-uuid' )
_         = require( 'lodash' )

class Context
  @modules: { }
  @agentType: undefined
  @facilityType: undefined
  @setModules: ( modules ) ->
    unless _.isPlainObject( modules )
      throw new TypeError( 'Modules is expected to be an object' )
    Context.modules = modules

  @setAgentType: ( type = undefined ) ->
    Context.agentType = type

  @setFacilityType: ( type = undefined ) ->
    Context.facilityType = type

  constructor: ->
    @moduleInstances = { }
    @id = uuid.v4( )

  getModule: ( moduleName ) ->
    name = moduleName.toLowerCase( )
    if @moduleInstances[ name ]?
      return @moduleInstances[ name ]
    module = Context.modules[ name ]
    if not module? or module not instanceof Function
      throw new Error(
        "Unknown module: #{ moduleName }"
      )
    return new module( @ )

  getModuleKeys: ->
    return _.keys(
      Context.modules
    )

  getModules: ->
    map = { }
    _.each( @getModuleKeys( ), ( key ) =>
      map[ key ] = @getModule( key )
    )
    return map

  getProtocol: ( moduleName, protocolName ) ->
    module = @getModule( moduleName )
    return module.getProtocol(
      protocolName
    )

  setAgent: ( agent ) ->
    unless not Context.agentType or agent instanceof Context.agentType
      throw new TypeError( 'Agent expected' )
    if @agent? and @agent.id isnt agent.id
      throw new Error( 'Context already has an agent' )
    @agent = agent

  hasAgent: ->
    return @agent?

  getAgent: ->
    unless @agent?
      throw new Error( 'Context has no agent' )
    return @agent

  setFacility: ( facility ) ->
    unless not Context.facilityType or facility instanceof Context.facilityType
      throw new TypeError( 'Facility expected' )
    @facility = facility

  hasFacility: ->
    return @facility?

  getFacility: ->
    unless @facility?
      throw new Error( 'Context has no facility' )
    return @facility

  getGroupId: ->
    agent = @getAgent( )
    return agent.group_id

  toJSON: ->
    return {
      id: @id
      agent: @agent
      facility_key: @facility?.uuid
    }

module.exports = Context