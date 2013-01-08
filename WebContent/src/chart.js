function chartLine() {
	window.chart = new Highcharts.Chart({
		chart : {
			renderTo : 'chart',
			type :'scatter',
			zoomType: 'x',
			height: 350
		},
		title : {
			text : 'MMM Day',
			x : -20
		},
		subtitle : {
			text : 'Daily min/max/mean temperatures',
			x : -20
		},
		xAxis : {
			type : 'datetime',
			title : {
				text : null
			}
		},
		yAxis : {
			title : {
				text : 'Temperature (°C)'
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
		series : [{
			name : 'Min',
			data : [],
			marker : {
				symbol : 'circle',
				radius : 2
			},
		}, {
			name : 'Max',
			data : [],
			marker : {
				symbol : 'circle',
				radius : 2
			},
		}, {
			name : 'Mean',
			data : [],
			marker : {
				symbol : 'circle',
				radius : 2
			},
		}]
	});
}