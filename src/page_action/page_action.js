// popup-page communication in manifest v3

function pageRequest(message, callback) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, message, callback);
	});
}

function test() {
	// get postcode
	pageRequest({action: "GetPostcodeData"}, function(response) {
		console.log(response);
		// get data
		compileData(response.postcode).then(function(data) {
			console.log(data);
			pageRequest({action: "GetAdditionalData"}, function(response) {
				data.additional = response;
				
				let price = CalculatePrice(data);
				// set price
				pageRequest({action: "ReplacePrice", data: "&euro; ???? /mnd"}, function(response) {
					console.log(response);
				});
			});
		});
	});
}

document.getElementById("button").addEventListener("click", test);
