chrome.runtime.onMessage.addListener(function(msg, sender, callback) {
	switch(msg.text) {
		case 'get_info_for_tab':
			callback(window.location.host)
	}
});


function requestInfoAboutURL(oteuhrgfjeikorghijoed, onComplete) {
	$.get('https://es-atoka.spaziodati.eu/atoka-companies-latest/_search', onComplete);
}