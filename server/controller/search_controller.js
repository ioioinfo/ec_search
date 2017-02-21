// Base routes for item..
exports.register = function(server, options, next){
	const uu_request = require('../utils/uu_request');
	var service_info = "ec search service";

	var do_get_method = function(url,cb){
		uu_request.get(url, function(err, response, body){
			if (!err && response.statusCode === 200) {
				var content = JSON.parse(body);
				do_result(false, content, cb);
			} else {
				cb(true, null);
			}
		});
	};
	//所有post调用接口方法
	var do_post_method = function(url,data,cb){
		uu_request.request(url, data, function(err, response, body) {
			console.log(body);
			if (!err && response.statusCode === 200) {
				do_result(false, body, cb);
			} else {
				cb(true,null);
			}
		});
	};
	//处理结果
	var do_result = function(err,result,cb){
		if (!err) {
			if (result.success) {
				cb(false,result);
			}else {
				cb(true,result);
			}
		}else {
			cb(true,null);
		}
	};
	var get_sorts = function(cb){
		server.plugins['models'].products_sorts.find_sorts(function(rows){
			if (rows.length > 0) {
				cb(false,rows);
			}else {
				cb(true,"分类信息不存在！");
			}
		});
	};
	var search_all_products = function(search_object,cb){
		var url = "http://127.0.0.1:18002/search_products_info";
		do_post_method(url,{"search_object":search_object},cb);
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
		//搜索所有商品,以及图片，接着加条件
		{
			method: 'POST',
			path: '/search_products',
			handler: function(request, reply){
				var search_object = request.payload.search_object;
				if (!search_object) {
					return reply({"success":false,"message":"param wrong","service_info":service_info});
				}
				search_all_products(search_object,function(err,results){
					if (!err) {
						console.log("results:"+JSON.stringify(results));
						return reply({"success":true,"message":"ok","rows":results.products,"service_info":service_info});
					}else {
						return reply({"success":false,"message":err,"service_info":service_info});
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
