"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _react = _interopRequireDefault(require("react"));

var _lodash = _interopRequireDefault(require("lodash.merge"));

var _gatsby = require("gatsby");

var _internal = require("./internal");

exports.onRenderBody = function (_ref, pluginOptions) {
  var setHeadComponents = _ref.setHeadComponents;

  var _merge = (0, _lodash.default)({}, _internal.defaultOptions, pluginOptions),
      feeds = _merge.feeds;

  var links = feeds.map(function (_ref2, i) {
    var output = _ref2.output,
        title = _ref2.title;

    if (output.charAt(0) !== "/") {
      output = "/" + output;
    }

    return _react.default.createElement("link", {
      key: "gatsby-plugin-feed-" + i,
      rel: "alternate",
      type: "application/rss+xml",
      title: title,
      href: (0, _gatsby.withPrefix)(output)
    });
  });
  setHeadComponents(links);
};