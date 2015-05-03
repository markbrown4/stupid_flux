
{ ThingActions } = App.Actions
{ smartDate, smartTime } = App.Filters

App.Components.Thing = React.createClass
  enable: (event)->
    event.preventDefault()

    ThingActions.enable(@props.id)

  disable: (event)->
    event.preventDefault()

    ThingActions.disable(@props.id)

  render: ->
    <li className={ "thing " + if @props.disabled then 'disabled' else '' }>
      <h2>{ @props.name }</h2>
      <p>Created at: { smartTime(@props.created_at) }</p>
      <p>Delivery date: { smartDate(@props.delivery_date) }</p>
      { if @props.disabled
        <a onClick={ @enable }>Enable</a>
      else
        <a onClick={ @disable }>Disable</a>
      }
    </li>
