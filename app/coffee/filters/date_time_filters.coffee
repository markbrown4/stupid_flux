
App.Filters.smartDate = (date)->
  moment(date).format 'MMM D'

App.Filters.smartTime = (date)->
  moment(date).format 'MMMM D, YYYY, h:mm:ss a'
