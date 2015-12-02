chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
	console.log('on clicked', arguments);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tab.url === 'chrome://newtab/') console.log('IGNORAMI');

	if (changeInfo.status === 'complete') {
		console.log('Asking data for tab ', tab.id);
		requestInfoAboutTab(tab);
		// chrome.tabs.sendMessage(tab.id, {text: 'get_info_for_tab'}, function(url) { console.log('## cb', url); });
	}

	console.log('on updated', tab.url, arguments);
});

chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
	console.log('on activated', arguments);
});


function requestInfoAboutTab(tab) {
	$.get('https://es-atoka.spaziodati.eu/atoka-companies-latest/_search', function(data) {
		console.log('-- ', data.hits.total);
		chrome.tabs.sendMessage(tab.id, {text: 'show_something', hits: data.hits.total}, function() { console.log('## cb', arguments); });	
	});
}