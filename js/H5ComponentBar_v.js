// 柱图组件对象
var H5ComponentBar_v = function(name,cfg) {
	var component = new H5ComponentBar(name, cfg);

	// 平均分配
	var width = (100/cfg.data.length);
	component.find('.line').width(width + '%');

	$.each(component.find('.rate'),function() {
		// 将水平的宽度设为垂直的高度
		var w = $(this).css('width');
		$(this).height(w).width('');
	});

	$.each(component.find('.per'),function() {
		$(this).appendTo($(this).prev(''));
	})

	return component;
}