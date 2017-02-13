/* 雷达图文组件对象 */
var H5ComponentRadar = function(name, config) {
	var component = new H5ComponentBase(name, config);

	// 绘制网格线 - 背景层
	var w = config.width,
		h = config.height;

	// 加入一块画布(网格线背景)
	var canvas = document.createElement('canvas'),
		context = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;

	component.append(canvas);

	var r = w/2,
		step = config.data.length;

	// 计算一个圆周上的坐标
	// 已知:圆心坐标(a, b),半径r,角度deg
	// rad = (2*Math.PI / 360) * (360/step) * i
	// x = a + Math.sin(rad) * r
	// y = b + Math.cos(rad) * r

	// 绘制网格背景(分面绘制,分为10份)
	for(let s = 10, isBlue = true; s > 0; s--) {
		context.beginPath();
		for(let i = 0, rad, x, y; i < step; i++) {
			rad = (2*Math.PI / 360) * (360/step) * i;
			x = r + Math.sin(rad) * r * (s/10);
			y = r + Math.cos(rad) * r * (s/10);

			context.lineTo(x, y);
		}
		context.closePath();
		context.fillStyle = (isBlue = !isBlue)? '#f1f9ff': '#99c0ff';
		context.fill();
	}

	// 绘制伞骨
	context.beginPath();
	for(let i = 0, rad, x, y; i < step; i++) {
		rad = (2*Math.PI / 360) * (360/step) * i;
		x = r + Math.sin(rad) * r;
		y = r + Math.cos(rad) * r;

		context.moveTo(r, r);
		context.lineTo(x, y);

		// 输出项目文字
		var text = $('<div class="text">');
		text.text(config.data[i][0]);
		text.css('transition', 'all 0.3s '+ (i*0.1) +'s');
		x > w/2? text.css('left', x/2+5) : text.css('right', (w-x)/2+5);
		y > h/2? text.css('top', y/2+5) : text.css('bottom', (h-y)/2+5);

		config.data[i][2] && text.css('color', config.data[i][2]);

		component.append(text);
	}
	context.strokeStyle = '#e0e0e0';
	context.stroke();

	// 数据层的开发
	// 加入一块画布(数据层)
	var canvas = document.createElement('canvas'),
		context = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;

	component.append(canvas);

	/* 
	 * 绘制折线以及对应的数据和阴影
	 * @param {float} per 0到1的数据,会根据这个值绘制最终数据对应的中间状态
	 * @return {DOM} component元素
	 */
	var draw = function(per = 1) {
		if(per >= 1) {
			component.find('.text').css('opacity', 1);
		}
		if(per <= 1) {
			component.find('.text').css('opacity', 0);
		}

		context.clearRect(0, 0, w, h);
		// 输出数据的折线
		context.beginPath();
		for(let i = 0, rad, x, y, rate; i < step; i++) {
			rad = (2*Math.PI / 360) * (360/step) * i;
			rate = config.data[i][1] * per;
			x = r + Math.sin(rad) * r * rate;
			y = r + Math.cos(rad) * r * rate;

			context.lineTo(x, y);
		}
		context.closePath();
		context.strokeStyle = '#f00';
		context.stroke();

		// 输出数据的点
		context.fillStyle = '#ff7676';
		for(let i = 0, rad, x, y, rate; i < step; i++) {
			rad = (2*Math.PI / 360) * (360/step) * i;
			rate = config.data[i][1] * per;
			x = r + Math.sin(rad) * r * rate;
			y = r + Math.cos(rad) * r * rate;

			context.beginPath();
			context.arc(x, y, 5, 0, 2*Math.PI);
			context.fill();
			context.closePath();
		}
	};

	component.on('onLoad', function() {
		// 雷达图生长动画
		var s = 0;
		for(let i = 0; i < 100; i++) {
			setTimeout(function() {
				s += 0.01;
				draw(s);
			}, i*10 + 500);
		}
	});

	component.on('onLeave', function() {
		// 雷达图退场动画
		var s = 1;
		for(let i = 0; i < 100; i++) {
			setTimeout(function() {
				s -= 0.01;
				draw(s);
			}, i*10);
		}
	});

	return component;
};