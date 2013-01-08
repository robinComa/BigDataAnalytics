var JobModel = Backbone.Model.extend({
	defaults : {
		id : null,
		computedby : null,
		coordinates : {
			lon : null,
			lat : null
		}
	},
	initialize : function() {

	},
	validate : function(attrs) {
		if (attrs.id == null || attrs.computedby == null || attrs.coordinates.lon == null || attrs.coordinates.lat == null) {
			return 'An args is null!';
		}
		if (this.validateExtend) {
			return this.validateExtend(attrs);
		}
	}
});


var JobResponseModel = JobModel.extend({
	urlRoot : [window.config.url.webService,'job',window.config.user.id, window.config.user.token,'response'].join('/'),
	defaults : {

	},
	initialize : function() {

	},
	validate : function(attrs) {

	}
});

var LinearModel = JobResponseModel.extend({
	defaults : {
		x : null,
		min : null,
		max : null,
		mean : null
	},
	initialize : function() {
		var attr = this.attributes;
		attr.x = parseInt(attr.x);
		_.each(attr.y, function(data) {
			attr[data.name] = parseFloat(data.value);
		});
	},
	validateExtend : function(attrs) {
		if (attrs.x == null || attrs.min == null || attrs.max == null || attrs.mean == null) {
			return 'An args is null!';
		} else if (attrs.min > attrs.mean || attrs.min > attrs.max || attrs.mean > attrs.max) {
			return 'Constraint Violation!';
		}
	}
});

var JobRequestModel = JobModel.extend({
	defaults : {
		service : null,
		script : null,
		x : {
			min : null,
			max : null,
		},
		y : []
	},
	urlRoot : [window.config.url.webService,'job',window.config.user.id, window.config.user.token,'request'].join('/'),
	initialize : function() {
		this.id = [window.config.user.id,window.config.user.countId++].join('');
		this.attributes.id = this.id;
		this.attributes.coordinates = window.config.user.coordinates;
	},
	validate : function(attrs) {
		if (attrs.id == null || attrs.requestedby == null || attrs.coordinates.lon == null || attrs.coordinates.lat == null || attrs.service == null) {
			return 'An args is null!';
		}
	}
});

var JobRequestListModel = Backbone.Collection.extend({
	model : JobRequestModel,
	initialize : function() {

	},
	save : function(){
		$.ajax({
			url : [window.config.url.webService,'job',window.config.user.id, window.config.user.token,'request','collection'].join('/'),
			type : 'POST',
			dataType : "json",
			contentType : 'application/json',
			data : JSON.stringify({jobRequest: this.models})
		});
	}
}); 