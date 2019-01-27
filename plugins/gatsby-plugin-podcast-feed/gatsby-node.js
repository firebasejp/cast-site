"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _xmlJs = require("xml-js");

var _lodash = _interopRequireDefault(require("lodash.merge"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _internal = require("./internal");

var publicPath = "./public";

var serialize = function serialize(_ref) {
  var _ref$query = _ref.query,
      site = _ref$query.site,
      allMarkdownRemark = _ref$query.allMarkdownRemark;
  return allMarkdownRemark.edges.map(function (edge) {
    var data = (0, _lodash.default)({}, edge.node.frontmatter);
    var about = data.about,
        audioLink = data.audioLink,
        contentType = data.contentType,
        duration = data.duration;
    data.pubDate = data.date;
    delete data.date;
    var enclosure = {
      '_attributes': {
        url: audioLink,
        type: contentType,
        length: duration
      }
    };
    delete data.about;
    delete data.contentType;
    delete data.audioLink;
    delete data.duration;
    return (0, _extends2.default)({}, data, {
      description: about + "\n\n" + edge.node.html,
      enclosure: enclosure,
      'itunes:duration': duration,
      url: site.siteMetadata.siteUrl + edge.node.fields.slug,
      guid: site.siteMetadata.siteUrl + edge.node.fields.slug
    });
  });
};

exports.onPostBuild =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(_ref2, pluginOptions) {
    var graphql, options, _iterator, _isArray, _i, _ref4, f, _options$f, setup, locals, serializer, items, header, _f$query$site$siteMet, title, author, description, link, category, image, explicit, language, rss, data, xml, outputPath, outputDir;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            graphql = _ref2.graphql;
            delete pluginOptions.plugins;
            options = (0, _lodash.default)({}, _internal.defaultOptions, pluginOptions);
            _context.next = 5;
            return (0, _internal.runQuery)(graphql, options.query);

          case 5:
            options.query = _context.sent;
            _iterator = options.feeds, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();

          case 7:
            if (!_isArray) {
              _context.next = 13;
              break;
            }

            if (!(_i >= _iterator.length)) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("break", 45);

          case 10:
            _ref4 = _iterator[_i++];
            _context.next = 17;
            break;

          case 13:
            _i = _iterator.next();

            if (!_i.done) {
              _context.next = 16;
              break;
            }

            return _context.abrupt("break", 45);

          case 16:
            _ref4 = _i.value;

          case 17:
            f = _ref4;

            if (!f.query) {
              _context.next = 23;
              break;
            }

            _context.next = 21;
            return (0, _internal.runQuery)(graphql, f.query);

          case 21:
            f.query = _context.sent;

            if (options.query) {
              f.query = (0, _lodash.default)(options.query, f.query);
              delete options.query;
            }

          case 23:
            _options$f = (0, _extends2.default)({}, options, f), setup = _options$f.setup, locals = (0, _objectWithoutPropertiesLoose2.default)(_options$f, ["setup"]);
            serializer = f.serialize && typeof f.serialize === "function" ? f.serialize : serialize;
            items = serializer(locals);
            header = {
              '_declaration': {
                '_attributes': {
                  'version': '1.0',
                  'encoding': 'utf-8'
                }
              }
            };
            _f$query$site$siteMet = f.query.site.siteMetadata, title = _f$query$site$siteMet.title, author = _f$query$site$siteMet.author, description = _f$query$site$siteMet.description, link = _f$query$site$siteMet.link;
            category = f.category, image = f.image, explicit = f.explicit, language = f.language;
            rss = {
              '_attributes': {
                'version': '2.0',
                'xmlns:googleplay': 'http://www.google.com/schemas/play-podcasts/1.0',
                'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
              },
              channel: {
                title: title,
                description: description,
                generator: f.generator || 'GatsbyJS',
                link: link
              }
            };

            if (author) {
              (0, _lodash.default)(rss.channel, {
                'googleplay:author': author,
                'itunes:author': author
              });
            }

            if (category) {
              (0, _lodash.default)(rss.channel, {
                category: category,
                'googleplay:category': category,
                'itunes:category': category
              });
            }

            if (image) {
              (0, _lodash.default)(rss.channel, {
                image: {
                  link: link,
                  title: title,
                  url: image
                },
                'googleplay:image': image,
                'itunes:image': image
              });
            }

            (0, _lodash.default)(rss.channel, {
              'language': language || 'en'
            });
            (0, _lodash.default)(rss.channel, {
              'googleplay:explicit': explicit || 'no',
              'itunes:explicit': explicit || 'no'
            });
            (0, _lodash.default)(rss.channel, {
              item: items
            });
            data = (0, _extends2.default)({}, header, {
              rss: rss
            });
            xml = (0, _xmlJs.js2xml)(data, {
              compact: true,
              ignoreComment: true,
              spaces: 2
            });
            outputPath = _path.default.join(publicPath, f.output);
            outputDir = _path.default.dirname(outputPath);

            if (!_fs.default.existsSync(outputDir)) {
              _mkdirp.default.sync(outputDir);
            }

            _context.next = 43;
            return (0, _internal.writeFile)(outputPath, xml);

          case 43:
            _context.next = 7;
            break;

          case 45:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2) {
    return _ref3.apply(this, arguments);
  };
}();