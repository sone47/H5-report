/* 饼图组件对象 */
var H5ComponentPie = function(name, config) {
	var component = new H5ComponentBase(name, config);

	// 绘制网格线 - 背景层
	var w = config.width,
		h = config.height;

	// 加入一块画布(网格线背景)
	var canvas = document.createElement('canvas'),
		context = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
	$(canvas).css('z-index',1);
	component.append(canvas);

	var r = w/2;

	//  加入一个底图层
	context.beginPath();
	context.fillStyle = '#eee';
	context.strokeStyle = '#eee';
	context.lineWidth = 1;
	context.arc(r, r, r, 0, 2*Math.PI);
	context.fill();
	context.stroke();

	// 绘制一个数据层
	var canvas = document.createElement('canvas'),
		context = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
	$(canvas).css('z-index',2);
	component.append(canvas);

	var colors = ['red', 'green', 'blue', '#a00', 'orange']; // 备用
	var sAngle = 1.5 * Math.PI, // 设置开始角度在12点钟位置
		eAngle = 0, // 结束角度
		aAngle = Math.PI * 2; // 100%的圆结束的角度

	var step = config.data.length;
	config.data.forEach(function(item, index) {
		let color = item[2] || (item[2] = colors.pop());
		eAngle = sAngle + aAngle * item[1];

		context.beginPath();
		context.fillStyle = color;
		context.strokeStyle = color;
		context.lineWidth = .1;

		context.moveTo(r, r);
		context.arc(r, r, r, sAngle, eAngle);
		context.fill();
		context.stroke();

		sAngle = eAngle;

		// 加入所有的项目文本以及百分比
		var text = $('<div class="text">');
		text.text(item[0]);
		var per = $('<div class="per">');
		per.text(item[1]*100 + '%');
		text.append(per);

		var x = r + Math.sin(0.5 * Math.PI-sAngle) * r,
			y = r + Math.cos(0.5 * Math.PI-sAngle) * r;

		x > w/2? text.css('left', x/2): text.css('right', (w-x)/2);
		y > h/2? text.css('top', y/2): text.css('bottom', (h-y)/2);

		text.css('color', item[2] || '#000');

		component.append(text);
	});

	// 加入一个蒙版层
	var canvas = document.createElement('canvas'),
		context = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;
	$(canvas).css('z-index',3);
	component.append(canvas);

	context.fillStyle = '#eee';
	context.strokeStyle = '#eee';
	context.lineWidth = 1;

	var draw = function(per = 1) {
		context.clearRect(0, 0, w, h);

		context.beginPath();

		context.moveTo(r, r);
		context.arc(r, r, r, sAngle, -2*Math.PI * per + sAngle, true);
		context.fill();
		context.stroke();

		if(per <= 0){
			component.find('.text').css('tansition', 'all 0s');
			H5ComponentPie.reSort(component.find('.text'));
			component.find('.text').css('tansition', '');
			component.find('.text').css('opacity', 1);
		}
	};
	draw(1);

	component.on('onLoad', function() {
		// 饼图生长动画
		var s = 1;
		for(let i = 0; i < 100; i++) {
			setTimeout(function() {
				s -= 0.01;
				draw(s);
			}, i*10 + 500);
		}
	});

	component.on('onLeave', function() {
		// 饼图退场动画
		var s = 0;
		for(let i = 0; i < 100; i++) {
			setTimeout(function() {
				s += 0.01;
				draw(s);
			}, i*10);
		}
	});

	return component;
};

// 重排项目文本元素
H5ComponentPie.reSort = function (list) {
	// 1.检测相交
	var compare = function(dom1, dom2) {
		var offset1 = $(dom1).offset(),
			offset2 = $(dom2).offset();

		// dom1,dom2的投影
		var shadow1_x = [offset1.left, offset1.left + $(dom1).width()],
			shadow1_y = [offset1.top, offset1.top + $(dom1).height()],
			shadow2_x = [offset2.left, offset2.left + $(dom2).width()],
			shadow2_y= [offset2.top, offset2.top + $(dom2).height()];

		// 检测x,y轴投影是否相交
		var intersect_x = (shadow1_x[0] > shadow2_x[0] && shadow1_x[0] < shadow2_x[1])
						|| (shadow2_x[0] > shadow1_x[0] && shadow2_x[0] < shadow1_x[1]),
			intersect_y = (shadow1_y[0] > shadow2_y[0] && shadow1_y[0] < shadow2_y[1])
						|| (shadow2_y[0] > shadow1_y[0] && shadow2_y[0] < shadow1_y[1]);

		return intersect_x && intersect_y;
	};

	// 2.错开重排
	var reset = function(dom1, dom2) {
		if($(dom1).css('top') !== 'auto') {
			$(dom1).css('top', parseInt($(dom1).css('top')) + $(dom2).height());
		}
		if($(dom1).css('bottom') !== 'auto') {
			$(dom1).css('bottom', parseInt($(dom1).css('bottom')) + $(dom2).height());
		}
	};

	// 定义将要重排的元素
	var willReset = [list[0]];

	$.each(list, function(index, item) {
		if(index > 0 && compare(list[index - 1], item)) {
			willReset.push(item);
		}
	});

	if(willReset.length > 1) {
		willReset.forEach(function(item, index) {
			if(willReset[index + 1]) {
				reset(item, willReset[index + 1]);
			} else {
				reset(item, willReset[index - 1]);
			}
		});
		H5ComponentPie.reSort(willReset);
	}
}