# Stupid Flux

I like the restrictions that Flux places around data flow but I found it very difficult to get started with.  This is a stupidly simple set of data-structuring to allow you to start building a typical web application with React and Flux easily.

The framework/ directory sits along-side your application code so nothing's hidden, extend and hack away at it to build your ideal API.  This is just a starting point for your own application framework.

## App

A directory structure and namespace so you can get started.

```coffee
App =
  Stores: {}
  Actions: {}
  Resources: {}
  Components: {}
  Filters: {}
```

## Factories

Here's how you can create Stores, Actions, Resources and Components:

### Stores

Stores maintain a set of data, expose public getters, listen to dispatched events that tell them they should update their data, and emit a `change` event when they do.

```coffee

# local data store
things = []
states = {
  loading: true
}

# public getters
App.Stores.ThingStore = ThingStore = App.createStore
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

App.Dispatcher.register
  'refresh-things': -> loadThings()
  'things-refreshed': (data)-> updateThings(data)

```

### Resources

Resources are a simple persistence layer where you can put API related methods.
They have RESTful methods and translate dates and utc timestamps from strings in your JSON API to JavaScript date objects.

```coffee

App.Resources.ThingResource = App.createResource
  urlRoot: '/api/things'

```

All methods return Promises

```coffee

ThingResource.query()
ThingResource.where(disabled: true)
ThingResource.get(1)
ThingResource.update(1, { name: 'Thing 2' })
ThingResource.create(name: 'Thing 3')
ThingResource.destroy(1)

```

### Components

Components can fetch data from a Stores public getters and listen to their `change` event and fire Actions.

```coffee

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

App.Actions.ThingActions = App.createActions
  refresh: ->
    @dispatch 'refresh-things'

    ThingResource.query (data)->
      @dispatch 'things-refreshed', data

```

## Dependencies

* React
* ReactRouter
* Reqwest
* Moment
* MicroEvent

## Have a play

```
git clone git@github.com:markbrown4/stupid_flux.git
cd stupid_flux
npm start

# run live-server in a separate proccess
npm run server

# run json-server in a separate proccess
npm run server
```
