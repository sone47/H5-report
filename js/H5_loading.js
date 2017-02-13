var H5_loading = function(images, firstPage) {

	var id = this.id;

	if(this._images === undefined) { // 第一次进入
		this._images = (images || []).length;
		this._load = 0;

		window[id] = this;
		images.forEach(function(item, index) {
			var img = new Image;

			img.src = item;
			img.onload = function() {
				this.loader(images, firstPage);
			}.bind(this);
		}.bind(this));

		$('#rate').text('0%');

		return this;
	} else {
		$('#rate').text(Math.ceil((++this._load) / this._images * 100) + '%');
		if(this._load < this._images) {
			return this;
		}
	}

	this.el.fullpage({
		onLeave: function(index, nextIndex, derection) {
			$(this).find('.h5_component').trigger('onLeave');
		},
		afterLoad: function(anchorLink, index) {
			$(this).find('.h5_component').trigger('onLoad');
		}
	});
	this.page[0].find('.h5_component').trigger('onLoad');
	this.el.show();
	firstPage && $.fn.fullpage.moveTo(firstPage);
	
};