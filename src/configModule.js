/* eslint-disable */
// Object.defineProperty(exports, "__esModule", { value: true });
// var Config;
// module.exports = (function (Config) {
//     Config["maxItems"] = 100;
//     Config["maxPageItems"] = 10;
//     Config["maxItemAtags"] = 50;
// })(Config = exports.Config || (exports.Config = {}));

// define('extM', function() {
//   var Config;
//   Config["maxItems"] = 100;
//   Config["maxPageItems"] = 10;
//   Config["maxItemAtags"] = 50;
//   return Config
// })

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery', 'underscore'], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'), require('underscore'))
  } else {
    root.Requester = factory(root.$, root._)
  }
}(this || window, ($, _) => {
  // this is where I defined my module implementation

  const Config = {}
  Config.maxItems = 100
  Config.maxPageItems = 10
  Config.maxItemAtags = 50
  return Config
}))
