var baseURL = 'http://localhost:8080';
//var baseURL = 'http://www.mygeopostcard.com';
var analysisPATH = "BigDataAnalytics";
var webServicePATH = "BigDataWebService";

var contryTemplate = [{
	lon : "30...50:8",
	lat : "-120...-70:8"
}, {
	lon : "10...30:8",
	lat : "70...84:8"
}, {
	lon : "40...55:8",
	lat : "-4...20:8"
}, {
	lon : "-12...-35:8",
	lat : "110...150:8"
}];

window.config = {
	user: {
		id: 1234567890,
		token: 'robinToken1234567890',
		login: 'USER ' + Math.round(Math.random() * 20),
		countId: 0,
		coordinates: DataFixture.generate(contryTemplate, 0)[DataFixture.getRandom(0, 3)]
	},
	url: {
		analysis : [baseURL,analysisPATH].join('/'),
		webService : [baseURL,webServicePATH].join('/')
	}
};