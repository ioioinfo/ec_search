// Base routes for item..
exports.register = function(server, options, next){
	var service_info = "ec search service";
	var get_sorts = function(cb){
		server.plugins['models'].products_sorts.find_sorts(function(rows){
			if (rows.length > 0) {
				cb(false,rows);
			}else {
				cb(true,"分类信息不存在！");
			}
		});
	};
	server.route([
		//产品id获得同类商品,以及图片
		{
			method: 'GET',
			path: '/search_sorts',
			handler: function(request, reply){
				get_sorts(function(err, rows){
					if (!err) {
						return reply({"success":true,"message":"ok","rows":rows,"service_info":service_info});
					}else {
						return reply({"success":false,"message":rows,"service_info":service_info});
					}
				});
			}
		},


    ]);

    next();
};

exports.register.attributes = {
    name: 'products_base'
};
