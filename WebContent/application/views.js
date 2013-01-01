var DataView = Backbone.View.extend({
	tagName : "div",
	className : "data-row alert alert-success",
	render : function() {
		return $(this.el).html(_.template($('#data-template').text())(this.model.toJSON()));
	}
});