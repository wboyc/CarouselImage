/**
 * 图片
 * @param Zepto 框架
 * @param jQuery 框架
 * @returns {Boolean}|object
 * @auth wangchao wangchaoxiaoban@gmail.com
 * @vision 1.0 2015年11月16日09:58:15
 * 请尊重作者劳动，转载和修改代码请注明出处！important
 * 后续作者在后面添加作者姓名和邮箱即可
 * 
 * @vision 2015年11月16日17:25:13 允许设置父节点，能够自动读取子节点
 **/

;(function(Zepto,jQuery,window,document,undefined) {
	var $='';
	if(typeof Zepto!='undefined' && Zepto){
		$=Zepto;
	}
	if(typeof jQuery!='undefined' && jQuery){
		$=jQuery;
	}
	if(!$ || typeof $==undefined){
		console.error("No frame jQuery OR Zepto");
		return false;
	}

	var carouseObj = function(){
		var carouseImage = {
				options:{
						carouseBox:'carouselImage-box',//遮罩层
						carouselList:[],
						currentImg:[],//用户点击的image
						imgList:[],//显示出来的所有image
						allul:[],//所有的UL，用于在多个图片切换时使用（暂时用不到），此为顶级父节点不局限于ul
						currentUl:'',//当前ul
						firstChildTag:'',//ul下的首个子节点
						showImage:[],//显示时的img html
						windowWidth:0,//窗口高度
						windowHeight:0,//窗口宽度
						startIndex:[],//第一次点击的图片索引
						firstChild:'',//图片列表的第一级子节点
						type:'touch',//默认的触发方式 touch 滑动|click 点击 
						currentIndex:0,//当前图片索引
						onLoad:function(Obj){
							//绑定点击之前的回调函数
						},
						afterLoad:function(Obj){
							//绑定之后的回调函数
						},
						onChangeBefore:function(Obj){
							//换图之前的操作
							
						},
						onChangeEnd:function(Obj){
							//换图之后的操作
						},
				},
				init:function(elems,param){
					var CI_this=this;
					$.extend(CI_this.options,param);//继承用户自定义方法
					
					$(elems).click(function(){
						CI_this._startshow(this);
						CI_this.options.onLoad.call(CI_this,CI_this.options);
					});
					
				},
				_initParam:function(param){
					
				},
				_startshow:function(_this){
					var CI_this=this;
					//var _this=this;
					//第一步冒泡查找最上级ul
					CI_this.options.currentImg=$(_this);
					
					if(CI_this.options.currentUl){
						CI_this.options.currentUl=$(CI_this.options.currentUl);
					}else{
						CI_this._getParentUl(_this);
					}
					
					//第二步获得ul下面的li
					CI_this.options.firstChild=$(CI_this.options.currentUl).find(':first-child');
					
					CI_this.options.firstChild=CI_this.options.firstChild[0];
					
					CI_this.options.firstChildTag=CI_this.options.firstChild.tagName;
					//第三步获取image列表。
					$.each(CI_this.options.currentUl.find(CI_this.options.firstChildTag),function(index,ele){
						CI_this.options.imgList[index]=$(ele).find("img:last").eq(0)[0];//TODO
						if(_this==CI_this.options.imgList[index]){//TODO $不能比较
							CI_this.options.startIndex=index;
						}
					});
					
					CI_this._getWindow();

					CI_this._getImage();

					var showhtml='<div class="'+CI_this.options.carouseBox+'" style="background-color: rgba(0,0,0,0.4);position: fixed;left: 0px;top: 0px;width: '+(CI_this.options.imgList.length*CI_this.options.windowWidth)+'px;height: 100%;z-index: 600;display: -webkit-box;"><ul class="carouselImage-list" style="list-style:none;">';
					$.each(CI_this.options.showImage,function(index,ele){
						showhtml+='<li class="carouselImage" style="width: 100%;-webkit-box-flex: 1;">'+ele+'</li>';
					});
					showhtml+='</ul></div>';
					

					$(showhtml).appendTo('body');
					
					CI_this.options.currentIndex=CI_this.options.startIndex;
					
					//遍历处理image 显示出第一张图片
					if(CI_this.options.type=='touch'){
						CI_this._touchMove(CI_this.options.startIndex);
					}else{
						CI_this._clickmove(CI_this.options.startIndex);
					}
					
					$('<span class="carouselClose" style="position: fixed;top:0px;right:0px;color:#ffffff;font-size:24px">X</span>').appendTo('.'+CI_this.options.carouseBox);
					$('.carouselClose').click(function(){
						CI_this._remove();
					});
					
					//afterShow();
					//CI_this.options.afterShow.call(CI_this,CI_this.options);
					
				},
				_show:function(){
					$('.'+this.options.carouseBox).show();
				},
				_hide:function(){
					$('.'+this.options.carouseBox).hide();
				},
				_remove:function(){
					$('.'+this.options.carouseBox).remove();
				},
				distory:function(){
					//carouseImage=null;
				},
				show:function(){
					this._show();
				},
				remove:function(){
					this._remove();
				},
				hide:function(){
					this._hide();
				},
				_getParentUl:function (dom){
					if(!this.options.allul){
						this.options.allul=$('ul');
					}
					this.options.currentUl=$(dom).closest('ul');
				},
				_getWindow:function(){//获取浏览器窗口长宽
					this.options.windowWidth= window['innerWidth'] || document.documentElement.clientWidth;
					this.options.windowHeight= window['innerHeight'] || document.documentElement.clientHeight;
				},
				_getImage:function(){
					var CI_this=this;
					$.each(CI_this.options.imgList,function(index,ele){
						var newimg= document.createElement('img');
						newimg.src=ele.src;
						var realWidth  = newimg.width;//图片真实宽度
			            var realHeight = newimg.height;//图片真实高度
			            var showWidth = parseInt(CI_this.options.windowWidth*0.9);//最大展示区域的图片宽度
			            var showHeight = parseInt(CI_this.options.windowHeight*0.8);//最大展示区域的图片高度
			            var showPaddingLeft=0;
						var height=0;
						var width=0;
						var posLeft=0;
						var posTop=0;
						//处理高和宽
						var percent=1;//使用的比例
						var widthPercent=1;//横向缩小的百分比
						var hightPercent=1;//纵向缩小的百分比
						if(realWidth>showWidth && realHeight>showHeight){
							//宽高都超过可以展示的面积
							widthPercent = parseFloat(showWidth/realWidth);
							hightPercent = parseFloat(showHeight/realHeight);
							percent = (widthPercent>hightPercent)?hightPercent:widthPercent;
											
						}else if(realWidth>showWidth && realHeight<=showHeight){
							//宽超过可以展示的面积
							
							percent = parseFloat(showWidth/realWidth);
							
						}else if(realWidth<=showWidth && realHeight>showHeight){
							//高度超过可展示的面积
							percent = parseFloat(showHeight/realHeight);

						}else if(realWidth<=showWidth && realHeight<=showHeight){
							//长宽都不超过可展示面积
							percent = parseFloat(showWidth/realWidth);
						}
						//最后确定显示的高和宽
						width = parseInt(realWidth*percent);
						height = parseInt(realHeight*percent);
						posLeft=index*CI_this.options.windowWidth;
						posTop=parseInt((CI_this.options.windowHeight-height)/2);
						showPaddingLeft=parseInt((CI_this.options.windowWidth-width)/2);
						CI_this.options.showImage[index]='<img src="'+newimg.src+'" class="carousel-image" style="position: absolute;padding-left:'+showPaddingLeft+'px;left:'+posLeft+'px;top:'+posTop+'px;width:'+width+'px;height:'+height+'px;" index="'+index+'"/>';
						
					});
					
				},
				_clickmove:function(selectindex){
					var CI_this=this;
					var car_image=$('.carousel-image');
					//var _this=this;
					car_image.click(function(){
						var nowindex=$(this).attr('index');
						
						$.each(car_image,function(index,ele){
							if(nowindex<car_image.length-1){
								var left=parseInt($(ele).css('left'));
								left=left-CI_this.options.windowWidth;
								$(ele).css('left',left+'px');
								CI_this.options.currentIndex=parseInt(nowindex)+1;
							}else{
								CI_this.options.currentIndex=0;
								var left=parseInt($(ele).css('left'));
								left=CI_this.options.windowWidth*index;
								$(ele).css('left',left+'px');
							}
						});
						CI_this.options.onChangeEnd.call(CI_this,CI_this.options);
					});
					
					if(selectindex!=0 && selectindex<=car_image.length-1){
						$.each(car_image,function(index,ele){
							var left=parseInt($(ele).css('left'));
							left=left-CI_this.options.windowWidth*selectindex;
							$(ele).css('left',left+'px');
						});
					}
					
				},
				_touchMove:function(selectindex){
					var CI_this=this;
					var startPosition={x:"",y:""};
					var endPosition={x:"",y:""};
					var changeX=0;
					var changeY=0;
					var car_image=$('.carousel-image');
					$.each(car_image,function(index,ele){
						this.addEventListener('touchstart', function (e) {
							e.preventDefault();
						    var touch = e.touches[0];
						    changeX=0;
						    startPosition = {
						        x: touch.screenX,
						        y: touch.screenY
						    }

						});
						this.addEventListener('touchmove', function (e) {
							e.preventDefault();
						    var touch = e.touches[0];
						    endPosition = {
						        x: touch.screenX,
						        y: touch.screenY
						    }
						    changeX=startPosition.x-endPosition.x;			    
						});
						this.addEventListener('touchend', function (e) {
							e.preventDefault();
							var nowindex=$(this).attr('index');
							
							if(changeX>10){
								$.each(car_image,function(index,ele){
									if(nowindex<car_image.length-1){
										//右移
										var left=parseInt($(ele).css('left'));
										left=left-CI_this.options.windowWidth;
										$(ele).animate({'left':left+'px'},200);
										CI_this.options.currentIndex=parseInt(nowindex)+1;
									}else{
										//最后一张返回第一张
										var left=parseInt($(ele).css('left'));
										left=CI_this.options.windowWidth*index;
										$(ele).animate({'left':left+'px'},400);
										CI_this.options.currentIndex=0;
									}
								});
							}else if(changeX<-10){
								$.each(car_image,function(index,ele){
									if(nowindex>0){
										//左移
										var left=parseInt($(ele).css('left'));
										left=left+CI_this.options.windowWidth;
										$(ele).animate({'left':left+'px'},200);
									}else{
										//第一张返回到最后一张
										var left=parseInt($(ele).css('left'));
										left=-CI_this.options.windowWidth*(car_image.length-1-index);
										$(ele).animate({'left':left+'px'},400);
									}
								});
							}else {
								CI_this._remove();
							}
							CI_this.options.onChangeEnd.call(CI_this,CI_this.options);
						});
					});
					
					if(selectindex!=0 && selectindex<=car_image.length-1){
						$.each(car_image,function(index,ele){
							var left=parseInt($(ele).css('left'));
							left=left-CI_this.options.windowWidth*selectindex;
							$(ele).css('left',left+'px');
						});
					}
					
				},
				_changeView:function(){
					//当前点击的是哪个
					var CI_this=this;
					
				},
			
			};
		
		$.extend(this, carouseImage);
	};
	
	
	$.fn.carouseWidget=function(param){
		obj = new carouseObj();
		obj.init(this, param);
		return obj ;
	};
	
})((typeof Zepto!='undefined')?Zepto:'',(typeof jQuery!='undefined')?jQuery:'',window,document);
