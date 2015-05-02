# Stupid Flux

A minimal set of data-structuring to be able to start building an app with React and Flux.

## App

A directory structure and namespace so you can get started.

```coffee
App =
  Stores: {}
  Actions: {}
  Resources: {}
  Components: {}
```

## Factories

Here's how you can create Stores, Actions, Resources and Components:

### Stores

Stores maintain a set of data, listen to dispatched events that tell them they should update their data, and emit a `'change'` event when they do.

```coffee

# local data store
things = []
states = {
  loading: true
}

# public getters
ThingStore = App.Stores.ThingStore = StupidFlux.createStore
  getState: ->
    things: things
    states: states

updateThings = (data)->
  states.loading = false
  things = data

  ThingStore.emitChange()

loadThings = ->
  states.loading = true

  ThingStore.emitChange()

Dispatcher.register
  'refresh-things': -> loadThings()
  'things-refreshed': (data)-> updateThings(data)

```

### Resources

Resources are a simple persistence layer where you can put API related methods.

```coffee

App.Resources.ThingResource = StupidFlux.createResource
  urlRoot: '/api/things'

```

### Components

Components can fetch data from Stores public getters and listen to their `'change'` event and fire Actions.

```

{ ThingStore } = App.Stores
{ ThingActions } = App.Actions

App.Components.Things = React.createClass
  getInitialState: ->
    ThingStore.getState()

  componentDidMount: ->
    ThingStore.bind 'change', @onChange
    ThingActions.refresh()

  componentWillUnmount: ->
    ThingStore.unbind 'change', @onChange

  onChange: ->
    @setState ThingStore.getState()

  render: ->
    <ul className="things">
      { for thing in @state.things
        <Thing {...thing} />
      }
    </ul>

```

### Actions

Actions are entry points for data changes across your application, they can dispatch events to stores and initiate communication with the server.

```coffee

{ ThingResource } = App.Resources

App.Actions.ThingActions = StupidFlux.createAction
  refresh: ->
    @dispatch 'refresh-things'

    ThingResource.query (data)->
      @dispatch 'things-refreshed', data

```

## Globals

StupidFlux exposes 5 globals

* App
* StupidFlux
* Dispatcher
* React
* ReactRouter
