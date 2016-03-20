# CarouselImage

功能介绍
-------------------------------------
A Image detail show widget 一个图片查看插件<br/>
用于手机端图片放大全屏查看，有点击切换和手势划动切换两种切换方式<br/>
使用时按照ul li img 的层次格式写即可，后期有时间会扩展成自定义层次支持<br/>
主要支持微信手机端，会自动按照页面窗口大小居中显示<br/>
![github](https://github.com/JustLittleBoy/CarouselImage/blob/master/images/%E6%88%AA%E5%9B%BE.gif "github")<br/>

使用方法
-------------------------------------
    <div class="box" >
    	<ul>
		<li><img class="img" src="images/1.jpg"/></li>
		<li><img class="img" src="images/2.jpg"/></li>
		<li><img class="img" src="images/3.jpg"/></li>
		<li><img class="img" src="images/4.jpg"/></li>
    	</ul>
    </div>
    <script type="text/javascript" >
    var obj=$('.img').carouseWidget({
    	//type:'click',//触发类型 click or touch
    	onLoad:function(obj){//第一次弹出图片之后执行的方法
    		console.log(obj.currentIndex);
    	},
    	onChangeEnd:function(obj){//图片切换结束之后执行的方法
		console.log(obj.currentIndex);//当前图片的索引 从0开始
    	},
    });
    </script>
图片按照ul 嵌套li li中放图片进行 li中可以有其他标签，但保证img不在被嵌套<br/>
打印obj 或者直接看源码中的注释，可以根据自己的需要获得数据
