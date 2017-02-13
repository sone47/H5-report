/* 散点图文组件对象 */
var H5ComponentPoint = function(name, config) {
	var component = new H5ComponentBase(name, config);
	
	var base = config.data[0][1]; // 以第一个数据的比例为大小的100%

	// 输出每一个Point
	config.data.forEach(function(item, index) {
		var point = $('<div class="point point_'+ index +'">');

		var name = $('<div class="name">' + item[0] + '</div>'),
			rate = $('<div class="per">' + (item[1]*100) + '%</div>');

		name.append(rate);
		point.append(name);

		var per = item[1]/base * 100 + '%';
		point.width(per).height(per);

		item[2] && point.css('backgroundColor', item[2]);

		if(item[3] !== undefined && item[4] !== undefined) {
			point.css('left', item[3]).css('top', item[4]);
			//暂存元素的位置
			point.data('left', item[3]).data('top', item[4]);
		}

		//设置zindex,重设位置w
		point.css('zIndex', 100 - index);
		point.css({
			left: 0,
			top: 0
		});

		point.css('transition', 'all 1s ' + index*0.5 + 's');
		component.append(point);

		component.on('onLoad',function () {
			component.find('.point').each(function (idx,item) {
				$(item).css({
					left: $(item).data('left'),
					top: $(item).data('top')
				});
			})
		})
		component.on('onLeave',function () {
			component.find('.point').each(function (idx,item) {
				$(item).css({
					left: 0,
					top: 0
				});
			})
		})

		//点击每个点时的圈层动画
		component.find('.point').on('click',function () {
			component.find('.point').removeClass('point_focus');
			$(this).addClass('point_focus');

			return false;
		}).eq(0).addClass('point_focus');

		component.append(point);
	});

	return component;
};