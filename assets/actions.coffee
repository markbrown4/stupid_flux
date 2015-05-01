
dispatch = (eventName, props)->
  Dispatcher.trigger eventName, props

@ThingActions =
  refresh: ->
    dispatch 'refresh-things'

    $.ajax
      url: '/api/things'
      success: (data)->
        dispatch 'things-refresh-success', data
      error: (data)->
        dispatch 'things-refresh-error', data

  disable: (id)->
    dispatch 'disable-thing', id

    $.ajax
      url: url = "/api/things/#{id}"
      data:
        disabled: true
      type: 'PATCH'
      success: (data)->
        dispatch 'things-disable-success', data
      error: (data)->
        dispatch 'things-disable-error', data
