/* 柱状图文组件对象 */
var H5ComponentBar = function(name, config) {
	var component = new H5ComponentBase(name, config);

	config.data.forEach(function(item, index) {
		var line = $('<div class="line">'),
			name = $('<div class="name">'),
			rate = $('<div class="rate">'),
			per = $('<div class="per">');

		var width = item[1] * 100 + '%';

		var bgStyle = null;
		item[2] && (bgStyle = 'style = "background-color:'+ item[2] +'"');

		rate.html('<div class="bg"'+ bgStyle +'></div>');

		rate.css('width',width);
		name.text(item[0]);
		per.text(width);

		line.append(name).append(rate).append(per);
		component.append(line);
	});

	return component;
};