"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.defaultOptions = exports.runQuery = exports.writeFile = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _fs = _interopRequireDefault(require("fs"));

var _pify = _interopRequireDefault(require("pify"));

var writeFile = (0, _pify.default)(_fs.default.writeFile);
exports.writeFile = writeFile;

var runQuery = function runQuery(handler, query) {
  return handler(query).then(function (r) {
    if (r.errors) {
      throw new Error(r.errors.join(", "));
    }

    return r.data;
  });
};

exports.runQuery = runQuery;
var defaultOptions = {
  generator: "GatsbyJS",
  query: "\n    {\n      site {\n        siteMetadata {\n          title\n          author\n          description\n          siteUrl\n          link: siteUrl\n          keywords\n        }\n      }\n    }\n  ",
  setup: function setup(_ref) {
    var _ref$query = _ref.query,
        siteMetadata = _ref$query.site.siteMetadata,
        rest = (0, _objectWithoutPropertiesLoose2.default)(_ref$query, ["site"]);
    return (0, _extends2.default)({}, siteMetadata, rest);
  },
  feeds: [{
    query: "\n      {\n        allMarkdownRemark(\n          limit: 1000,\n          sort: {\n            order: DESC,\n            fields: [frontmatter___date]\n          }\n        ) {\n          edges {\n            node {\n              frontmatter {\n                title\n                date\n                about\n                contentType\n                duration\n                audioLink\n              }\n              fields {\n                slug\n              }\n              excerpt\n              html\n            }\n          }\n        }\n      }\n    ",
    output: "feed.xml",
    title: null
  }]
};
exports.defaultOptions = defaultOptions;