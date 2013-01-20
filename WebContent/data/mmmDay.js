self.onmessage=function(oEvent){postMessage(main(oEvent.data));};

function main(args){
	var DAY = 1000 * 60 * 60 * 24;
	var xMin = parseInt(args.min);
	var results = [];
	var curDay = -1;
	var indexDay = 0;
	var indexInDay = -1;
	var min = Number.MAX_VALUE;
	var max = -Number.MAX_VALUE;
	var mean = 0.0;
				
	//args.plotTelemetry contains 1 day or 2 day or 30 day... (it is define by the worker X split)
	for (var i in args.plotTelemetry) {
					
		var date = new Date(parseInt(args.plotTelemetry[i].d) * 1000 + xMin);
		var value = parseFloat(args.plotTelemetry[i].v);
		
		if(date.getDate() != curDay){
			//push last day computed results
			if(curDay != -1){
				results.push({
					x : xMin + DAY * indexDay,
					y : [
						{name : 'min', value : min},
						{name : 'max', value : max},
						{name : 'mean', value : mean}
					]
				});
			}
			indexDay++;
			indexInDay = 0;
			curDay = date.getDate();
			min = Number.MAX_VALUE;
			max = -Number.MAX_VALUE;
			mean = 0.0;
		}else{
			indexInDay++;
		}
		
		if (min > value) {
			min = value;
		}
		if (max < value) {
			max = value;
		}
		mean = (mean * indexInDay + value) / (indexInDay + 1);
	}
	//push last day results
	results.push({
		x : xMin + DAY * indexDay,
		y : [
			{name : 'min', value : min},
			{name : 'max', value : max},
			{name : 'mean', value : mean}
		]
	});
	return results;
}