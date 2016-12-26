var _ = require('lodash');
var EventProxy = require('eventproxy');

var products_sorts = function(server) {
	return {
		find_sorts: function(callback) {
			var query = `select id, sort_name, parent, same_group, img_location FROM products_sorts where flag =0`;

			server.plugins['mysql'].pool.getConnection(function(err, connection) {

				connection.query(query, function(err, results) {
					if (err) {
						throw err;
					}
					connection.release();
					callback(results);
				});
			});
		},

	};
};

module.exports = products_sorts;
