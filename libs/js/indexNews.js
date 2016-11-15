

var app = angular.module('myApp', ['ngSanitize']);
app.controller('myController', function($scope, $http) {
	var api = {
		headers: {
			apikey: '9a0377f67476733b42ea794a4c9a9efa'
		},
		method: "get",
		url: "http://apis.baidu.com/showapi_open_bus/showapi_joke/joke_text",
		params: {
			page: 1
		}
	}//笑话的API
	
	var newsApi = {
		headers:{apikey:'83cbb656acbed16b181c2e0652d7e89c'},
		method:"get",
		url:"http://apis.baidu.com/showapi_open_bus/channel_news/search_news",
		params:{
			page:1,
			channelId:'5572a109b3cdc86cf39001db'
		}
	}//新闻的API
	
	//首次加载
	$http(newsApi).success(function(data){
		$('.mui-spinner').eq(0).remove();	
		var _news = data.showapi_res_body.pagebean.contentlist;
		console.log(_news);
		$scope.news = _news;
	})
	
	
	mui.init({
		swipeBack: false,
	});
	
	mui('.mui-scroll-wrapper').scroll({
		indicators: true //是否显示滚动条
	});
	
	//设置高度 否则scroll失败
	var itemHeight = $(document).height() - 88;
	$('.mui-slider-item').css('height', itemHeight);
	
	var num=0;//判断是否换了页
	
	
	
	
	
	
	
	
	//左右轮滑事件
	mui(".content").on('swipeleft', '.mui-slider-item', function() {
		//if(num !=$('.mui-control-item').index('.mui-active'))
		
		console.log($('.mui-control-item').data('num'));
		console.log(this);
		
		mui('#item2mobile .mui-scroll').pullToRefresh({
			up: {
				callback: function() {
					var self = this;
					setTimeout(function() {
						//var ul = self.element.querySelector('.mui-table-view');
						//ul.appendChild(createFragment(ul, index, 5));
						api.params.page+=1
						$http(api).success(function(data){
							$scope.arr =  $scope.arr.concat(data.showapi_res_body.contentlist);
							self.endPullUpToRefresh(true);
						})						
					}, 500);
				}
			}
		});
		
		//请求数据
		$http(api).success(function(data) {
			$scope.arr = data.showapi_res_body.contentlist;
			$('.mui-spinner').eq(0).remove();	
		});
		
	});
	
})



//	var api={
//			headers: {
//				apikey: '9a0377f67476733b42ea794a4c9a9efa'
//			},
//			type: "get",
//			url: "http://apis.baidu.com/showapi_open_bus/showapi_joke/joke_text",
//			async: false,
//			data: {
//				page: 1
//			},
//			success: function(data) {
//				//console.log(data.showapi_res_body.pagebean.contentlist);
//				$scope.arr = data.showapi_res_body.contentlist;
//			}
//	};
//	$.ajax(api);

