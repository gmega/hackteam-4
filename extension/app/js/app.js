chrome.browserAction.onClicked.addListener(function() {
	console.log('on clicked listener', arguments);
	alert(1);
});

// When the page is activated (or the tab is getting the focus)
chrome.tabs.onActivated.addListener(function() {
	console.log('on activated', arguments);
	alert(window.location);
	$(document).prepend('<div>omgomgomg</div>')
});

chrome.tabs.onUpdated.addListener(function() {
	console.log('on updated', arguments);
	alert(3);

});


// Urls is replaced with something else
chrome.tabs.onReplaced.addListener(function() {
	console.log('on replaced', arguments);
	alert(5);

});

//chrome.tabs.executeScript(tabId, {
//    file: 'app/page_runtime.js',
//    runAt: 'document_start'
//});
