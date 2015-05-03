
{ ThingResource } = App.Resources

App.Actions.ThingActions = App.createActions
  refresh: ->
    @dispatch 'refresh-things'

    ThingResource.query().then (data)=>
      @dispatch 'refresh-things-success', data

  disable: (id)->
    @dispatch 'disable-thing', id

    ThingResource.update(id, { disabled: true }).then (data)=>
      @dispatch 'disable-thing-success'


  enable: (id)->
    @dispatch 'enable-thing', id

    ThingResource.update(id, { disabled: false }).then (data)=>
      @dispatch 'enable-thing-success'
