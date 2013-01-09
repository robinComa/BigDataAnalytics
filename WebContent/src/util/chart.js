function Chart() {
	var ELEMENT_ID = 'chart';
	this.scatter = function(data){
		var series = [];
		for(var i in data.data.y.series){
			series[i] = {
				name : data.data.y.series[i],
				data : [],
				marker : {
					symbol : 'circle',
					radius : 2
				}
			}
		}
		new Highcharts.Chart({
			chart : {
				renderTo : ELEMENT_ID,
				type :'scatter',
				zoomType: 'x',
				height: 400
			},
			title : {
				text : data.name,
				x : -20
			},
			subtitle : {
				text : data.description,
				x : -20
			},
			xAxis : {
				type : data.data.x.type,
				title : {
					text : data.data.x.label
				}
			},
			yAxis : {
				title : {
					text : data.data.y.label
				},
				plotLines : [{
					value : 0,
					width : 1,
					color : '#808080'
				}]
			},
			tooltip : {
				formatter : function() {
					return '<b>' + this.series.name + ' : </b>' + this.y + '°C' + '<br>' + Highcharts.dateFormat('%d/%m/%Y', this.x) ;
				},
			},
			series : series
		});
	}
}