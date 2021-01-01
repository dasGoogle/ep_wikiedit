/*
 * the express server hook
*/

express = require("express");
var path = require('path');

exports.expressCreateServer = function (hook_name, args, cb) {
  // serve the serve the create page html
  args.app.get('/w', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../static/workspace/create.html'));
  })
  // serve workspace html
  args.app.get('/w/*', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/../static/workspace/index.html'));
  })

  // serve the static files under /static/workspace/
  args.app.use("/workspace_res/local/", express.static(path.resolve(__dirname + '/../static/workspace/')))

  // serve vue
  args.app.use("/workspace_res/vue/", express.static("./node_modules/vue/dist/"))
   // serve materialize
   args.app.use("/workspace_res/mcss/", express.static("./node_modules/materialize-css/dist/"))

   //serve icon font
   args.app.use("/workspace_res/fonts/", express.static("./node_modules/material-icons-font/"))

   return true;
}
