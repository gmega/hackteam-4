// A function to use as callback
function doStuffWithDom(domContent) {
	alert(1);
    console.log('I received the following DOM content:\n' + domContent);
}

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
});

chrome.tabs.onUpdated.addListener(function() {
	console.log('on updated', arguments);
});
