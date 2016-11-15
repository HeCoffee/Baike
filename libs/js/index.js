var api={
	method:'get',
	url:'http://route.showapi.com/255-1',
	params:{
		"showapi_timestamp": formatterDateTime(),
        "showapi_appid": '26947', //这里需要改成自己的appid
        "showapi_sign": '947d2c9e114d486f81487ef10ffa8ada',  //这里需要改成自己的应用的密钥secret，
 		'type':29,
 		page:1
	}
}


//存放type数组
var typeArr=['29','10','31','41'];

//初始化每一组的页数,并进行记录
var pageArr=[];
pageArr['29']=1;//段子
pageArr['10']=1;//美图
pageArr['31']=1;//音频
pageArr['41']=1;//视频


var app=angular.module('heapp',['ionic','globalApp']);

app.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);


app.controller('mycontent',['$scope','$http','$ionicSideMenuDelegate','$ionicSlideBoxDelegate',function($scope,$http,$ionicSideMenuDelegate,$ionicSlideBoxDelegate){
	$scope.toggleLeft = function() {
	    $ionicSideMenuDelegate.toggleLeft();
	};
	
	$scope.jump=function(i){
		$ionicSlideBoxDelegate.slide(i);
	}
	$scope.data={};
	//初始化数组
	$scope.data['29']=[];
	$scope.data['10']=[];
	$scope.data['31']=[];
	$scope.data['41']=[];
	//页面第一次打开
	$http(api).success(function(response){
		$scope.data['29']=response.showapi_res_body.pagebean.contentlist;
		$('.emptybox').eq(0).remove();
		$('.mark').hide();
	})
	
	//加载更多
	$scope.loadMore=function(i){
		api.params.type=i;
		api.params.page=pageArr[i]+1;
		pageArr[i]+=1;
		$http(api).success(function(response){
			$scope.data[i]=$scope.data[i].concat(response.showapi_res_body.pagebean.contentlist);
			$scope.$broadcast('scroll.infiniteScrollComplete');
		})
		
	}
	
	//下拉刷新
	$scope.doRefresh=function(i){
		api.params.type=i;
		api.params.page=1;
		pageArr[i]=1
		$http(api).success(function(response){
			$scope.data[i]=response.showapi_res_body.pagebean.contentlist;
			$scope.$broadcast('scroll.refreshComplete');
		})
	}
	
	//换页面是否加载新数据
	$scope.slideHasChanged=function(index){
		$('.bar-subheader span').removeClass().eq(index).addClass('active');
		if($scope.data[typeArr[index]].length!=0){
			return;
		}else{//等于0，就是第一次新加载
			api.params.type=typeArr[index];
			api.params.page=1;
			$('.mark').show();
			$http(api).success(function(response){
				$scope.data[typeArr[index]]=response.showapi_res_body.pagebean.contentlist;
				$('.emptybox','.box:eq('+index+')').remove();
				console.log(response);
				$('.mark').hide();
			})
		}
	}
	//看video
	$scope.playVideo=function(obj){
		$scope.bigbox=true;
		$scope.video=obj;
		$scope.bigvideo=true;
		//$('video')[i].controls=true;
	}
	
	//全屏查看
	$scope.bigbox=false;
	$scope.bigImg=function(obj){
		$scope.bigbox=true;
		$scope.bigphoto=true;
		$scope.bigimg=obj;
	}
	//退出全屏
	$scope.esc=function(){
		$scope.bigbox=false;
		$scope.bigphoto=false;
		$scope.bigvideo=false;
	}

	
}]);

