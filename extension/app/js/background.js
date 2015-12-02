var isActive = false;

chrome.browserAction.onClicked.addListener(function(tab) {
	isActive = !isActive;

	if (!isActive) {
		removeInfo(tab.id);
    deactivate();
	} else {
		startLoading();
		injectCSS(tab.id)
		chrome.tabs.sendMessage(tab.id, {text: 'get_page_info'}, function(info) { 
			requestInfoAboutTab(tab, info);
		});
	}
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (!isActive) { return; }

	if (tab.url === 'chrome://newtab/') { return; }

	if (changeInfo.status === 'loading') {
		startLoading();
		injectCSS(tabId);
	}

	if (changeInfo.status === 'complete') {
		chrome.tabs.sendMessage(tab.id, {text: 'get_page_info'}, function(info) { 
			requestInfoAboutTab(tab, info);
		});
	}

});


function requestInfoAboutTab(tab, info) {
	var postData = {
		"url": info.url,
		"encoding": info.encoding
	};

	console.log('Requesting info about ', tab.id, postData);
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

function injectCSS(tabId) {
    chrome.tabs.insertCSS(tabId, {file: "app/css/atoka_ext.css", runAt: "document_start"});
}

function removeInfo(tabId) {
	chrome.tabs.sendMessage(tabId, {text: 'remove'});		
}


var restIcon = 'app/icons/atoka_48.png',
	loadingIcons = [
		'app/icons/load1.png',
		'app/icons/load2.png',
		'app/icons/load3.png',
		'app/icons/load4.png',
	],
  nonActiveIcon = 'app/icons/deactivated.png';

var isLoading = false,
	currentLoadingIcon = 0;

function startLoading() {
	isLoading = true;
  chrome.browserAction.setTitle({ title: '...loading...'})
	window.setTimeout(rotateIcon, 300);
}

function stopLoading() {
	isLoading = false;
   	chrome.browserAction.setIcon({ path: restIcon });
    chrome.browserAction.setTitle({ title: 'Click to deactivate the Atoka extension!'})
}

function deactivate(){
  isLoading = false;
    chrome.browserAction.setIcon({ path: nonActiveIcon });
    chrome.browserAction.setTitle({ title: 'Click to activate the Atoka extension!'})
}

function rotateIcon() {               
   if (isLoading) {
   		chrome.browserAction.setIcon({ path: loadingIcons[currentLoadingIcon] });
		currentLoadingIcon = (currentLoadingIcon + 1) % loadingIcons.length;
		window.setTimeout(rotateIcon, 300);
   }
}