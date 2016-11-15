var api={
	method:'get',
	url:'http://route.showapi.com/109-35',
	params:{
		"showapi_timestamp": formatterDateTime(),
        "showapi_appid": '26947', //这里需要改成自己的appid
        "showapi_sign": '947d2c9e114d486f81487ef10ffa8ada',  //这里需要改成自己的应用的密钥secret，
// 		'channelId':'5572a108b3cdc86cf39001cd',
   		'channelName':'',
// 		'page':1
	}
}

//存放type数组
var typeArr=['','互联网最新','科技最新','科普最新'];

//初始化每一组的页数,并进行记录
var pageArr=[];
pageArr['']=1;//段子
pageArr['互联网最新']=1;//美图
pageArr['科技最新']=1;//音频
pageArr['科普最新']=1;//视频



var app=angular.module('mynews',['ionic','globalApp']);
app.controller('myNewsBox',['$scope','$http','$ionicSideMenuDelegate','$ionicSlideBoxDelegate',function($scope,$http,$ionicSideMenuDelegate,$ionicSlideBoxDelegate){
	$scope.news={};
	//初始化数组
	$scope.news['']=[];
	$scope.news['互联网最新']=[];
	$scope.news['科技最新']=[];
	$scope.news['科普最新']=[];
	$http(api).success(function(response){
		console.log(response);
		$scope.news['']=response.showapi_res_body.pagebean.contentlist;
		$('.emptybox').eq(0).remove();
		$('.mark').hide();
	});
	
	//跳转
	$scope.jump=function(i){
		$ionicSlideBoxDelegate.slide(i);
	}
	$scope.showdetail=false;
	$scope.detail=function(obj){
		$scope.showdetail=true;
		$scope.detailObj=obj;
		var arr=obj.allList;
		console.log(obj)
		
	}
	
	$scope.type=function(obj){
		if(typeof obj =='object'){
			return false;
		}else{
			return true;
		}
	}
	$scope.hideDetail=function(){
		$scope.showdetail=false;
	}
	
	
	//加载更多
	$scope.loadMore=function(i){
		api.params.channelName=i;
		api.params.page=pageArr[i]+1;
		pageArr[i]+=1;
		$http(api).success(function(response){
			$scope.news[i]=$scope.news[i].concat(response.showapi_res_body.pagebean.contentlist);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		})
		
	}
	
	//下拉刷新
	$scope.doRefresh=function(i){
		api.params.channelName=i;
		api.params.page=1;
		pageArr[i]=1
		$http(api).success(function(response){
			$scope.news[i]=response.showapi_res_body.pagebean.contentlist;
			$scope.$broadcast('scroll.refreshComplete');
		})
	}
	
	//换页面是否加载新数据
	$scope.slideHasChanged=function(index){
		$('.bar-subheader span').removeClass().eq(index).addClass('active');
		if($scope.news[typeArr[index]].length!=0){
			return;
		}else{//等于0，就是第一次新加载
			api.params.channelName=typeArr[index];
			api.params.page=1;
			$('.mark').show();
			$http(api).success(function(response){
				$scope.news[typeArr[index]]=response.showapi_res_body.pagebean.contentlist;
				$('.emptybox','.box:eq('+index+')').remove();
				$('.mark').hide();
			})
		}
	}
}]);