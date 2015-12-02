chrome.runtime.onMessage.addListener(function(msg, sender, callback) {
	switch(msg.text) {
		case 'get_info_for_tab':
			callback(window.location.host)
			break;
		case 'show_something':
			console.log(' sada');
			$('body').prepend('<div>AAAAAAA '+ msg.hits +'</div>');
	}
});