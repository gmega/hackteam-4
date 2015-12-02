chrome.browserAction.onClicked.addListener(function(tab) {
	console.log('on clicked', arguments);
    injectCSS(tab);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tab.url === 'chrome://newtab/') { return;}

	if (changeInfo.status === 'loading') {
		startLoading();
	}

	if (changeInfo.status === 'complete') {
		chrome.tabs.sendMessage(tab.id, {text: 'get_page_url'}, function(url) { 
			requestInfoAboutTab(tab, url);
		});
	}

	console.log('on updated', tab.url, arguments);
});

chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
	console.log('on activated', arguments);
});


function requestInfoAboutTab(tab, url) {
	var postData = { "url": url };

	$.ajax({
  		url: 'http://hetzy1.spaziodati.eu:8083/api/annotate',
 		type: "POST",
  		data: JSON.stringify(postData),
  		contentType:"application/json; charset=utf-8",
  		dataType:"json",
  		success: function(data){
    		showResult(tab.id, data);
    		stopLoading();
  		},
  		error: function(xhr, error, response) {
    		stopLoading();
  			console.log('## Error from endpoint', arguments);
  			showError(tab.id, response);
  		}
	});
}

function showResult(tabId, data) {
	chrome.tabs.sendMessage(tabId, {text: 'show_result', data: data});	
}

function showError(tabId, data) {
	chrome.tabs.sendMessage(tabId, {text: 'show_error', data: data});	
}

function injectCSS(tab) {
    chrome.tabs.insertCSS(tab.tabId, {file: "app/css/atoka_ext.css", runAt: "document_start"});
}


var restIcon = 'app/icons/atoka_48.png',
	loadingIcons = [
		'app/icons/load1.png',
		'app/icons/load2.png',
		'app/icons/load3.png',
		'app/icons/load4.png',
	];

var isLoading = false,
	currentLoadingIcon = 0;

function startLoading() {
	isLoading = true;
	window.setTimeout(rotateIcon, 300);
}
function stopLoading() {
	isLoading = false;
   	chrome.browserAction.setIcon({ path: restIcon });
}

function rotateIcon() {               
   if (isLoading) {
   		chrome.browserAction.setIcon({ path: loadingIcons[currentLoadingIcon] });
		currentLoadingIcon = (currentLoadingIcon + 1) % loadingIcons.length;
		window.setTimeout(rotateIcon, 300);
   }
}