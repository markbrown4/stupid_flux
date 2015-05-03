
{ ThingStore } = App.Stores
{ ThingActions } = App.Actions
{ Thing } = App.Components
{ Link } = ReactRouter

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
    <div>
      <p><Link to="home">Back home</Link></p>
      <ul className="things">
        { for thing in @state.things
          <Thing {...thing} />
        }
      </ul>
    </div>
