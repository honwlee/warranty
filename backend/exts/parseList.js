module.exports = {
    parse: function(name, req, res, queryKeys) {
        let path = require('path'),
            dbpath = path.join(__dirname, "../dbs"),
            dbms = require('../lib/dbms/'),
            _ = require('lodash'),
            db = dbms(dbpath, {
                master_file_name: "master.json"
            });
        let total = 0,
            chain = db.get(name),
            // Remove q, _start, _end, ... from req.query to avoid filtering using those
            // parameters
            q = req.query.search,
            _start = req.query.offset,
            _end = req.query.end,
            _page = req.query.page,
            _sort = req.query.sort,
            _order = req.query.order,
            _limit = req.query.limit;
        delete req.query.search;
        delete req.query.offset;
        delete req.query.end;
        delete req.query.page;
        delete req.query.order;
        delete req.query.limit;

        // Automatically delete query parameters that can't be found
        // in the database
        Object.keys(req.query).forEach(function(query) {
            var arr = db.get(name).value();
            for (var i in arr) {
                if (_.has(arr[i], query) || query === 'callback' || query === '_' || /_lte$/.test(query) || /_gte$/.test(query) || /_ne$/.test(query) || /_like$/.test(query)) return;
            }
            delete req.query[query];
        });
        if (q) {
            // Full-text search
            // q = q.toLowerCase();
            chain = chain.filter(function(obj) {
                for (var key in queryKeys) {
                    if (obj[queryKeys[key]] === q) return true;
                }
            });
        }

        Object.keys(req.query).forEach(function(key) {
            // Don't take into account JSONP query parameters
            // jQuery adds a '_' query parameter too
            if (key !== 'callback' && key !== '_') {
                (function() {
                    // Always use an array, in case req.query is an array
                    var arr = [].concat(req.query[key]);

                    chain = chain.filter(function(element) {
                        return arr.map(function(value) {
                            var isDifferent = /_ne$/.test(key);
                            var isRange = /_lte$/.test(key) || /_gte$/.test(key);
                            var isLike = /_like$/.test(key);
                            var path = key.replace(/(_lte|_gte|_ne|_like)$/, '');
                            var elementValue = _.get(element, path);

                            if (elementValue === undefined) {
                                return;
                            }

                            if (isRange) {
                                var isLowerThan = /_gte$/.test(key);

                                return isLowerThan ? value <= elementValue : value >= elementValue;
                            } else if (isDifferent) {
                                return value !== elementValue.toString();
                            } else if (isLike) {
                                return new RegExp(value, 'i').test(elementValue.toString());
                            } else {
                                return value === elementValue.toString();
                            }
                        }).reduce(function(a, b) {
                            return a || b;
                        });
                    });
                })();
            }
        });
        // Sort
        if (_sort) {
            _order = _order || 'ASC';

            chain = chain.sortBy(function(element) {
                return _.get(element, _sort);
            });

            if (_order === 'DESC') {
                chain = chain.reverse();
            }
        }

        // Slice result
        if (_end || _limit || _page) {
            res.setHeader('X-Total-Count', chain.size());
            total = chain.size();
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count' + (_page ? ', Link' : ''));
        }

        if (_page) {
            _page = parseInt(_page, 10);
            _page = _page >= 1 ? _page : 1;
            _limit = parseInt(_limit, 10) || 10;
            var page = utils.getPage(chain.value(), _page, _limit);
            var links = {};
            var fullURL = getFullURL(req);

            if (page.first) {
                links.first = fullURL.replace('page=' + page.current, 'page=' + page.first);
            }

            if (page.prev) {
                links.prev = fullURL.replace('page=' + page.current, 'page=' + page.prev);
            }

            if (page.next) {
                links.next = fullURL.replace('page=' + page.current, 'page=' + page.next);
            }

            if (page.last) {
                links.last = fullURL.replace('page=' + page.current, 'page=' + page.last);
            }

            res.links(links);
            chain = _.chain(page.items);
        } else if (_end) {
            _start = parseInt(_start, 10) || 0;
            _end = parseInt(_end, 10);
            chain = chain.slice(_start, _end);
        } else if (_limit) {
            _start = parseInt(_start, 10) || 0;
            _limit = parseInt(_limit, 10);
            chain = chain.slice(_start, _start + _limit);
        }

        res.json({
            total: total,
            rows: chain.value()
        });
    }

}
