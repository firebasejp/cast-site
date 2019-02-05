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
      allMarkdownRemark = _ref$query.allMarkdownRemark,
      profile = _ref$query.profile,
      image = _ref.image;
  return allMarkdownRemark.edges.map(function (edge) {
    var data = (0, _lodash.default)({}, edge.node.frontmatter);
    var about = data.about,
        starring = data.starring,
        audioLink = data.audioLink,
        contentType = data.contentType,
        duration = data.duration,
        explicit = data.explicit;
    data.pubDate = new Date(data.date).toUTCString();
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
    var casts = profile.edges.reduce(function (o, _ref2) {
      var node = _ref2.node;
      o[node.id] = node;
      return o;
    }, {});
    var starringHtml = ['<ul>'].concat(starring.map(function (id) {
      var profile = casts[id];

      if (!profile) {
        throw new Error("No profile " + id);
      }

      var displayName = profile.displayName,
          url = profile.url;
      return "<li><a href=\"" + url + "\" target=\"_blank\" rel=\"noopener\">" + displayName + "(@" + id + ")</a></li>";
    })).concat(['</ul>']).join('\n');
    var description = about + "\n\n<h2>Starring</h2>\n" + starringHtml + "\n\n" + edge.node.html;
    return (0, _extends2.default)({}, data, {
      description: description,
      'itunes:subtitle': description,
      enclosure: enclosure,
      'itunes:duration': duration,
      link: site.siteMetadata.siteUrl + edge.node.fields.slug,
      guid: {
        '_attributes': {
          isPermaLink: 'true'
        },
        '_text': site.siteMetadata.siteUrl + edge.node.fields.slug
      },
      'itunes:explicit': explicit || 'no',
      'media:thumbnail': {
        '_attributes': {
          url: image
        }
      }
    });
  });
};

exports.onPostBuild =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(_ref3, pluginOptions) {
    var graphql, options, _iterator, _isArray, _i, _ref5, f, _options$f, setup, locals, serializer, items, header, _f$query$site$siteMet, title, author, description, link, category, image, explicit, language, rss, keywords, data, xml, outputPath, outputDir;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            graphql = _ref3.graphql;
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

            return _context.abrupt("break", 48);

          case 10:
            _ref5 = _iterator[_i++];
            _context.next = 17;
            break;

          case 13:
            _i = _iterator.next();

            if (!_i.done) {
              _context.next = 16;
              break;
            }

            return _context.abrupt("break", 48);

          case 16:
            _ref5 = _i.value;

          case 17:
            f = _ref5;

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
                'xmlns:atom': 'http://www.w3.org/2005/Atom',
                'xmlns:googleplay': 'http://www.google.com/schemas/play-podcasts/1.0',
                'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
                'xmlns:media': 'http://search.yahoo.com/mrss/',
                'xml:lang': language || 'en'
              },
              channel: {
                'atom:link': {
                  '_attributes': {
                    href: link + '/' + f.output,
                    rel: 'self',
                    type: 'application/rss+xml'
                  }
                },
                title: title,
                description: description,
                generator: f.generator || 'GatsbyJS',
                link: link
              }
            };

            if (f.keywords && Array.isArray(f.keywords)) {
              keywords = f.keywords.join(',');
              (0, _lodash.default)(rss.channel, {
                'media:keywords': keywords,
                'itunes:keywords': keywords
              });
            }

            if (description) {
              (0, _lodash.default)(rss.channel, {
                'itunes:subtitle': description
              });
            }

            if (author) {
              (0, _lodash.default)(rss.channel, {
                'googleplay:author': author,
                'itunes:author': author
              });
            }

            if (f.itunes && f.itunes.owner) {
              (0, _lodash.default)(rss.channel, {
                'itunes:owner': {
                  'itunes:name': f.itunes.owner.name,
                  'itunes:email': f.itunes.owner.email
                }
              });
            }

            if (category) {
              (0, _lodash.default)(rss.channel, {
                category: category,
                'googleplay:category': category,
                'itunes:category': category,
                'media:category': {
                  '_attributes': {
                    scheme: 'http://www.itunes.com/dtds/podcast-1.0.dtd'
                  },
                  '_text': category
                }
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

            _context.next = 46;
            return (0, _internal.writeFile)(outputPath, xml);

          case 46:
            _context.next = 7;
            break;

          case 48:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2) {
    return _ref4.apply(this, arguments);
  };
}();