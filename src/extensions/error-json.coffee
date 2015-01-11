Object.defineProperty( Error.prototype, 'toJSON', {
  value: ->
    alt = { }
    Object.getOwnPropertyNames( @ )
    .forEach( ( key ) ->
      alt[ key ] = @[ key ]
    , @ )
    return alt
})