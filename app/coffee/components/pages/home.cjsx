
{ Link } = ReactRouter

App.Components.Home = React.createClass
  render: ->
    <div>
      <h2>Home</h2>
      <p>The stupidest flux implementation</p>
      <p><Link to="things">List of things</Link></p>
    </div>
