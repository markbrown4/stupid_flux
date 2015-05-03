
{ Route, DefaultRoute } = ReactRouter
{ AppLayout, Home, Things } = App.Components

routes = (
  <Route handler={AppLayout} path="/">
    <DefaultRoute name="home" handler={Home} />
    <Route name="things" handler={Things} />
  </Route>
)

document.addEventListener "DOMContentLoaded", ->
  ReactRouter.run routes, (Handler)->
    React.render(<Handler/>, document.body)
