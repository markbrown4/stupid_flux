
# local data store
things = []
states = {
  loading: false
}

# public getters
ThingStore = App.Stores.ThingStore = App.createStore
  getState: ->
    things: things
    states: states

loadingThings = ->
  states.loading = true

  ThingStore.emitChange()

updateThings = (data)->
  states.loading = false
  things = data

  ThingStore.emitChange()

enableThing = (id)->
  for thing in things
    thing.disabled = false if thing.id == id

  ThingStore.emitChange()

disableThing = (id)->
  for thing in things
    thing.disabled = true if thing.id == id

  ThingStore.emitChange()

App.Dispatcher.register
  'refresh-things': -> loadingThings()
  'refresh-things-success': (data)-> updateThings(data)
  'disable-thing': (id)-> disableThing(id)
  'enable-thing': (id)-> enableThing(id)
