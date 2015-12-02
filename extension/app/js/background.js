chrome.browserAction.onClicked.addListener(function(tab) {
	console.log('on clicked', arguments);
    injectCSS(tab);

    /* 
    chrome.tabs.executeScript({
        code: 'document.body.style.backgroundColor="red"'
    }); 
	*/
});

// chrome.browserAction.setPopup({'popup': 'app/index.html'});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tab.url === 'chrome://newtab/') { return; }

	if (changeInfo.status === 'complete') {
		chrome.tabs.sendMessage(tab.id, {text: 'get_raw_html'}, function(html) { 
			requestInfoAboutTab(tab, html);
		});
	}

	console.log('on updated', tab.url, arguments);
});

chrome.tabs.onActivated.addListener(function(tabId, changeInfo, tab) {
	console.log('on activated', arguments);
});


function requestInfoAboutTab(tab, html) {
	var postData = {
		"domain": "www.google.it",
   		"html": html,
   		"encoding": "UTF-8"
	};

	$.ajax({
  		url: 'http://hetzy2.spaziodati.eu:8083/api/annotate',
 		type: "POST",
  		data: JSON.stringify(postData),
  		contentType:"application/json; charset=utf-8",
  		dataType:"json",
  		success: function(data){
    		chrome.tabs.sendMessage(tab.id, {text: 'show_result', data: data});	
  		}
	});
}

function injectCSS(tab) {
    chrome.tabs.insertCSS(tab.tabId, {file: "app/css/atoka_ext.css", runAt: "document_start"}, function() { console.log("CSS loaded"); })
}