/*
 * handle the socketio traffic for the sidebar
*/

exports.socketio = function (hook_name, args, cb) {
  // init the socketio stuff
  var io = args.io

  // init the db
  var db = require('ep_etherpad-lite/node/db/DB').db

  // handle clients
  io.sockets.on('connection', function (client) {
    client.on('workspace.join', function (workspaceId) {
      var dbKey = 'workspace:' + workspaceId

      // send initial data on join
      console.log('someone joined the workspace with id: ' + workspaceId)
      db.get(dbKey, function (err, value) {
        if (!value) {
          value = {'title': workspaceId, 'pads': [
              {'title': 'Home', 'id': 'workspace:' + workspaceId + '.home'}
            ]
          }
        }
        client.emit('workspace.update:' + workspaceId, value)
      });

      // write updates to db and publish them
      client.on('workspace.update', function (updateEvent) {
        db.set(dbKey, updateEvent)
        io.sockets.emit('workspace.update:' + workspaceId, updateEvent)
      })
    })
  })

  return true;
}
