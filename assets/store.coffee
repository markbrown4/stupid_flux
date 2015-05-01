
things = []
errors = []

findThing = (id)->
  _.find things, (t)-> t.id == id

updateThings = (data)->
  things = data

  ThingStore.trigger 'change'

disableThing = (id)->
  thing = findThing(id)
  thing.disabled = true

  ThingStore.trigger 'change'

updateErrors: (data)->
  errors = data

@ThingStore =
  getState: ->
    things: things
    errors: errors

MicroEvent.mixin @ThingStore

Dispatcher.register
  'disable-thing': (id)-> disableThing(id)
  'things-refresh-success': (data)-> updateThings(data)
  'things-refresh-error': (data)-> updateErrors(data)
