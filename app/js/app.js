(function() {
  var Actions, Resource, Store, formatDateTimes, formatDates, method, parseDates, queryString;

  this.App = {
    Stores: {},
    Actions: {},
    Resources: {},
    Components: {},
    Filters: {}
  };

  App.Dispatcher = {
    register: function(events) {
      var callback, eventName, results;
      results = [];
      for (eventName in events) {
        callback = events[eventName];
        results.push(this.bind(eventName, callback));
      }
      return results;
    }
  };

  MicroEvent.mixin(App.Dispatcher);

  Actions = {
    dispatch: function(name, payload) {
      return App.Dispatcher.trigger(name, payload);
    }
  };

  App.createActions = function(obj) {
    return Object.assign(Object.create(Actions), obj);
  };

  queryString = function(obj) {
    var key, params, val;
    params = [];
    for (key in obj) {
      val = obj[key];
      params.push(key + "=" + (encodeURIComponent(val)));
    }
    return params.join('&');
  };

  method = function(action) {
    switch (action) {
      case 'index':
        return 'get';
      case 'show':
        return 'get';
      case 'update':
        return 'patch';
      case 'create':
        return 'post';
      case 'destroy':
        return 'delete';
    }
  };

  parseDates = function(data, fields) {
    var field, i, len;
    for (i = 0, len = fields.length; i < len; i++) {
      field = fields[i];
      data[field] = moment(data[field]).toDate();
    }
    return data;
  };

  formatDates = function(data, fields) {
    var field, i, len;
    for (i = 0, len = fields.length; i < len; i++) {
      field = fields[i];
      data[field] = moment(data[field]).format('YYYY-MM-DD');
    }
    return data;
  };

  formatDateTimes = function(data, fields) {
    var field, i, len;
    for (i = 0, len = fields.length; i < len; i++) {
      field = fields[i];
      data[field] = moment(data[field]).utc().format();
    }
    return data;
  };

  Resource = {
    dateFields: [],
    dateTimeFields: [],
    request: function(action, params, id, data) {
      var r;
      r = reqwest({
        url: this.url(id, params),
        method: method(action),
        data: this.beforeRequest(data, action),
        type: 'json'
      }).then((function(_this) {
        return function(data) {
          return _this.afterResponse(data, action);
        };
      })(this));
      return r;
    },
    url: function(id, params) {
      var url;
      url = this.urlRoot;
      if (id != null) {
        url += "/" + id;
      }
      if (params != null) {
        url += "?" + (queryString(params));
      }
      return url;
    },
    beforeRequest: function(data, action) {
      if (data == null) {
        return;
      }
      if (this.dateFields.length > 0) {
        data = formatDates(data, this.dateFields);
      }
      if (this.dateTimeFields.length > 0) {
        data = formatDateTimes(data, this.dateTimeFields);
      }
      return data;
    },
    afterResponse: function(data, action) {
      if (data == null) {
        return;
      }
      if (this.dateFields.length > 0) {
        data = parseDates(data, this.dateFields);
      }
      if (this.dateTimeFields.length > 0) {
        data = parseDates(data, this.dateTimeFields);
      }
      return data;
    },
    query: function(params) {
      return this.request('index', params);
    },
    where: function(params) {
      return this.request('index', params);
    },
    get: function(id, params) {
      return this.request('show', params, id);
    },
    update: function(id, data) {
      return this.request('update', null, id, data);
    },
    create: function(data) {
      return this.request('create', null, null, data);
    },
    destroy: function(id) {
      return this.request('destroy', null, id);
    }
  };

  App.createResource = function(obj) {
    return Object.assign(Object.create(Resource), obj);
  };

  Store = {
    emitChange: function() {
      return this.trigger('change');
    }
  };

  App.createStore = function(obj) {
    var store;
    store = Object.assign(Object.create(Store), obj);
    MicroEvent.mixin(store);
    return store;
  };

}).call(this);

(function() {
  App.Filters.smartDate = function(date) {
    return moment(date).format('MMM D');
  };

  App.Filters.smartTime = function(date) {
    return moment(date).format('MMMM D, YYYY, h:mm:ss a');
  };

}).call(this);

(function() {
  App.Resources.ThingResource = App.createResource({
    urlRoot: 'http://localhost:3000/things',
    dateTimeFields: ['created_at'],
    dateFields: ['delivery_date']
  });

}).call(this);

(function() {
  var ThingStore, disableThing, enableThing, loadingThings, states, things, updateThings;

  things = [];

  states = {
    loading: false
  };

  ThingStore = App.Stores.ThingStore = App.createStore({
    getState: function() {
      return {
        things: things,
        states: states
      };
    }
  });

  loadingThings = function() {
    states.loading = true;
    return ThingStore.emitChange();
  };

  updateThings = function(data) {
    states.loading = false;
    things = data;
    return ThingStore.emitChange();
  };

  enableThing = function(id) {
    var i, len, thing;
    for (i = 0, len = things.length; i < len; i++) {
      thing = things[i];
      if (thing.id === id) {
        thing.disabled = false;
      }
    }
    return ThingStore.emitChange();
  };

  disableThing = function(id) {
    var i, len, thing;
    for (i = 0, len = things.length; i < len; i++) {
      thing = things[i];
      if (thing.id === id) {
        thing.disabled = true;
      }
    }
    return ThingStore.emitChange();
  };

  App.Dispatcher.register({
    'refresh-things': function() {
      return loadingThings();
    },
    'refresh-things-success': function(data) {
      return updateThings(data);
    },
    'disable-thing': function(id) {
      return disableThing(id);
    },
    'enable-thing': function(id) {
      return enableThing(id);
    }
  });

}).call(this);

(function() {
  var ThingResource;

  ThingResource = App.Resources.ThingResource;

  App.Actions.ThingActions = App.createActions({
    refresh: function() {
      this.dispatch('refresh-things');
      return ThingResource.query().then((function(_this) {
        return function(data) {
          return _this.dispatch('refresh-things-success', data);
        };
      })(this));
    },
    disable: function(id) {
      this.dispatch('disable-thing', id);
      return ThingResource.update(id, {
        disabled: true
      }).then((function(_this) {
        return function(data) {
          return _this.dispatch('disable-thing-success');
        };
      })(this));
    },
    enable: function(id) {
      this.dispatch('enable-thing', id);
      return ThingResource.update(id, {
        disabled: false
      }).then((function(_this) {
        return function(data) {
          return _this.dispatch('enable-thing-success');
        };
      })(this));
    }
  });

}).call(this);

(function() {
  var RouteHandler;

  RouteHandler = ReactRouter.RouteHandler;

  App.Components.AppLayout = React.createClass({
    render: function() {
      return React.createElement("div", null, React.createElement("div", {
        "id": "header"
      }, React.createElement("h1", null, "StupidFlux")), React.createElement("div", {
        "id": "content"
      }, React.createElement(RouteHandler, null)));
    }
  });

}).call(this);

(function() {
  var Link;

  Link = ReactRouter.Link;

  App.Components.Home = React.createClass({
    render: function() {
      return React.createElement("div", null, React.createElement("h2", null, "Home"), React.createElement("p", null, "The stupidest flux implementation"), React.createElement("p", null, React.createElement(Link, {
        "to": "things"
      }, "List of things")));
    }
  });

}).call(this);

(function() {
  var ThingActions, ref, smartDate, smartTime;

  ThingActions = App.Actions.ThingActions;

  ref = App.Filters, smartDate = ref.smartDate, smartTime = ref.smartTime;

  App.Components.Thing = React.createClass({
    enable: function(event) {
      event.preventDefault();
      return ThingActions.enable(this.props.id);
    },
    disable: function(event) {
      event.preventDefault();
      return ThingActions.disable(this.props.id);
    },
    render: function() {
      return React.createElement("li", {
        "className": "thing " + (this.props.disabled ? 'disabled' : '')
      }, React.createElement("h2", null, this.props.name), React.createElement("p", null, "Created at: ", smartTime(this.props.created_at)), React.createElement("p", null, "Delivery date: ", smartDate(this.props.delivery_date)), (this.props.disabled ? React.createElement("a", {
        "onClick": this.enable
      }, "Enable") : React.createElement("a", {
        "onClick": this.disable
      }, "Disable")));
    }
  });

}).call(this);

(function() {
  var Link, Thing, ThingActions, ThingStore;

  ThingStore = App.Stores.ThingStore;

  ThingActions = App.Actions.ThingActions;

  Thing = App.Components.Thing;

  Link = ReactRouter.Link;

  App.Components.Things = React.createClass({
    getInitialState: function() {
      return ThingStore.getState();
    },
    componentDidMount: function() {
      ThingStore.bind('change', this.onChange);
      return ThingActions.refresh();
    },
    componentWillUnmount: function() {
      return ThingStore.unbind('change', this.onChange);
    },
    onChange: function() {
      return this.setState(ThingStore.getState());
    },
    render: function() {
      var thing;
      return React.createElement("div", null, React.createElement("p", null, React.createElement(Link, {
        "to": "home"
      }, "Back home")), React.createElement("ul", {
        "className": "things"
      }, (function() {
        var i, len, ref, results;
        ref = this.state.things;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          thing = ref[i];
          results.push(React.createElement(Thing, React.__spread({}, thing)));
        }
        return results;
      }).call(this)));
    }
  });

}).call(this);

(function() {
  var AppLayout, DefaultRoute, Home, Route, Things, ref, routes;

  Route = ReactRouter.Route, DefaultRoute = ReactRouter.DefaultRoute;

  ref = App.Components, AppLayout = ref.AppLayout, Home = ref.Home, Things = ref.Things;

  routes = React.createElement(Route, {
    "handler": AppLayout,
    "path": "/"
  }, React.createElement(DefaultRoute, {
    "name": "home",
    "handler": Home
  }), React.createElement(Route, {
    "name": "things",
    "handler": Things
  }));

  document.addEventListener("DOMContentLoaded", function() {
    return ReactRouter.run(routes, function(Handler) {
      return React.render(React.createElement(Handler, null), document.body);
    });
  });

}).call(this);
