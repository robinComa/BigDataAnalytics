self.onmessage = function(oEvent) {
	postMessage(main(oEvent.data));
};

function main(args){
	var min = Number.MAX_VALUE;
	var max = Number.MIN_VALUE;
	var mean = 0.0;
	for (var i in args.plotTelemetry) {
		i = parseInt(i);
		var value = parseFloat(args.plotTelemetry[i].v);
		if (min > value) {
			min = value;
		}
		if (max < value) {
			max = value;
		}
		mean = (mean * i + value) / (i + 1);
	}
	return [
	    {name : 'min', value : min},
	    {name : 'max', value : max},
	    {name : 'mean', value : mean}
	];
}