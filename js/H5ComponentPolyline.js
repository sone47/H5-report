/* 折线图文组件对象 */
var H5ComponentPolyline = function(name, config) {
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

	// 水平网格线 100份 -> 10份
	var stepHorizantal = 10;
	context.beginPath();
	context.lineWidth = 1;
	context.strokeStyle = '#aaa';

	for(let i = 0, y; i < stepHorizantal+1; i++) {
		y = h / stepHorizantal * i;

		context.moveTo(0, y);
		context.lineTo(w, y);
	}

	//垂直网格线(根据项目的个数去分)
	var stepVertical = config.data.length + 1;
	for(let i = 0, x, text, text_w = w/stepHorizantal >> 0; i < stepVertical+1; i++) {
		x = w / stepVertical * i;

		context.moveTo(x, 0);
		context.lineTo(x, h);

		if(config.data[i]) {
			text = $('<div class="text">');
			text.text(config.data[i][0]);
			text.css({
				width: text_w,
				left: x/2 + text_w/2
			});
			component.append(text);
		}
	}

	context.stroke();

	// 加入画布 - 数据层
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
		// 清空画布
		context.clearRect(0, 0, w, h);
		// 绘制折线数据
		context.beginPath();
		context.lineWidth = 3;
		context.strokeStyle = '#ff8878';

		// 画圈
		config.data.forEach(function(item, index) {
			var x = w / stepVertical * (index+1),
				y = (1-item[1] * per) * h;
			
			context.moveTo(x, y);
			context.arc(x, y, 5, 0, 2*Math.PI);
		});

		// 连线
		context.moveTo(w / stepVertical, (1- config.data[0][1] * per) * h);
		config.data.forEach(function(item, index) {
			var x = w / stepVertical * (index+1),
				y = (1-item[1] * per) * h;
			context.lineTo(x, y);
		});
		context.stroke();

		// 绘制阴影
		context.lineWidth = 1;
		context.strokeStyle = 'rgba(255, 136, 120, 0)';
		context.lineTo(w / stepVertical * config.data.length, h);
		context.lineTo(w / stepVertical, h);
		context.fillStyle = 'rgba(255, 136, 120, 0.2)';
		context.fill();

		// 写数据
		config.data.forEach(function(item, index) {
			var x = w / stepVertical * (index+1),
				y = (1-item[1] * per) * h;
			context.fillStyle = item[2] ? item[2] : '#595959';
			context.fillText((item[1]*100 >> 0) + '%', x-10, y-10);
		});

		context.stroke();
	};

	component.on('onLoad', function() {
		// 折线图生长动画
		var s = 0;
		for(let i = 0; i < 100; i++) {
			setTimeout(function() {
				s += 0.01;
				draw(s);
			}, i*10 + 500);
		}
	});

	component.on('onLeave', function() {
		// 折线图退场动画
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