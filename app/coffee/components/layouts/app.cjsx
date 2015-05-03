
{ RouteHandler } = ReactRouter

App.Components.AppLayout = React.createClass
  render: ->
    <div>
      <div id="header">
        <h1>StupidFlux</h1>
      </div>
      <div id="content">
        <RouteHandler />
      </div>
    </div>
