
@Things = React.createClass
  getInitialState: ->
    Store.getState()

  componentDidMount: ->
    ThingStore.bind 'change', @onChange
    ThingActions.refresh()

  componentWillUnmount: ->
    ThingStore.unbind 'change', @onChange

  onChange: ->
    @setState ThingStore.getState()

  render: ->
    <ul>
      { for thing in @state.things
        <Thing {...thing} />
      }
    </ul>

@Thing = React.createClass
  disable: (event)->
    event.preventDefault()

    ThingActions.disable(@props.id)

  render: ->
    classes = if @props.disabled then 'disabled' else ''
    <li className={ classes }>
      <h2>{ @props.name }</h2>
      { if !@props.disabled
        <a onClick={ @disable }>Disable</a>
      }
    </li>

$ ->
  React.render <Things />, $('#things')[0]
