/**
 * jQuery Effect Extension
 * @author youharutou 2014
 * @explain Effect对象
 * 网站常用的效果都封装到Effect对象中，使用时先创建该对象实例，然后调用相应的方法即可
 */

(function ($) {
	$.extend({
		Effect: function(){}
		
	});
	
	
	/**
	 * 滚动到某一位置自动漂浮
	 * @function scrollFloat
	 * @param (jQuery Object) listener 监听器
	 * @param (jQuery Object) jq 漂浮的目标对象
	 * @param (Number) top 漂浮时相对窗口顶部的位置
	 * @param (jQuery Object) ctn 漂浮块的载体，漂浮块不能超出载体范围
	 * @param (Number) bufferH 缓存高度，用于计算参考高度
	 */
	$.Effect.prototype.scrollFloat = function(listener, jq, top, ctn, bufferH){
		var sf = new Object;
		var mstop, land;
		bufferH = bufferH || 0;
		sf._unit = function(){
			mstop = getTop(listener[0]) ? (getTop(jq.parent()[0]) - getTop(listener[0])) : getTop(jq.parent()[0]) - bufferH;
			land = ctn ? ctn.height() - jq.outerHeight() : 0;
		}
		sf._listen = function(){
			listener.scroll(function(){
				var condition = ctn ? (listener.scrollTop() >= mstop && listener.scrollTop() < mstop + land) : listener.scrollTop() >= mstop;
				if(condition){
					jq.css({
						position: "fixed",
						top: top ? top : 0,
						zIndex: 19
					});
				}
				else {
					jq.css({
						position: "relative",
						top: ctn && listener.scrollTop() > mstop ? land : 0,
						zIndex: 0
					});
				}
			});
		}
		sf._unit();
		sf._listen();
		return sf;
	}
	
	/**
	 * 滑动切换效果
	 * @function slideSwitch
	 * @param (HTMLElement) t 触发切换的tab
	 * @param (jQuery Object) list 切换的内容列表
	 */
	$.Effect.prototype.slideSwitch = function(t,list){
		if(!$(t).hasClass("current")) {
			var osTop = getTop($(t).parent().parent()[0]);
			if($(document).scrollTop() > osTop){
				$(document).scrollTop(osTop);
			}
			var ori = $(t).parent().find(".current").index();
			var i = $(t).index();
			$(t).addClass("current").siblings().removeClass("current");
			list.children().height("auto");
			list.attr("id", "keyframes" + ori + i);
			setTimeout(function(){list.children().eq(i).siblings().height(1)}, 300);
		}
	}
	
	/**
	 * 左右整体滑动
	 * @function wholePrevNextSlide
	 * @param (jQuery Object) prev 向右滑动按钮
	 * @param (jQuery Object) next 向左滑动按钮
	 * @param (jQuery Object) list 滑动项列表
	 * @param (Number) step 每次滑动的距离
	 * @param (Number) num 列表容器显示的项目数量
	 */
	$.Effect.prototype.wholePrevNextSlide = function(prev, next, list, step, num){
		var i = 0;
		prev.click(function(){
			if(!list.is(":animated")){
				i == 0 ? i = Math.ceil(list.children().length / num) - 1 : i--;
				list.animate({left: - i * step}, 300);
			}
		});
		next.click(function(){
			if(!list.is(":animated")){
				i == Math.ceil(list.children().length / num) - 1 ? i = 0 : i++;
				list.animate({left: - i * step}, 300);
			}
		});
	}
	
	/**
	 * 页面下滚淡入效果
	 * @function scrollFadeIn
	 * @param (jQuery Object) obj 接受动画的对象
	 * @param (String) cla 指定动画的class
	 * @param (Number) delay 延迟执行的时间，单位毫秒
	 * @param (Number) refer 统一参考容器，用于计算触发高度
	 */
	$.Effect.prototype.scrollFadeIn = function(refer, obj, cla, delay){
		var oTop = getTop(refer[0]);
		if(oTop > $(document).scrollTop() && oTop < $(window).height() + $(document).scrollTop()){
			delay ? setTimeout(function(){obj.addClass(cla)}, delay) : obj.addClass(cla);
		}
		else {
			var referH = oTop - $(window).height();
			$(window).scroll(function(){
				if($(document).scrollTop() > referH){
					delay ? setTimeout(function(){obj.addClass(cla)}, delay) : obj.addClass(cla);
				}
			});
		}
	}
})(jQuery);