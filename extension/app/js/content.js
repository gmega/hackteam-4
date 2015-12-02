chrome.runtime.onMessage.addListener(function(msg, sender, callback) {
	switch(msg.text) {
		case 'get_info_for_tab':
			callback(window.location.host)
			break;

		case 'get_raw_html':
			callback(document.all[0].outerHTML);
			break;

		case 'get_page_url':
			callback(window.location.href);
			break;

		case 'show_something':
			$('body').prepend('<div class="atoka-div">AAAAAAA '+ msg.hits +'</div>');
			break;

		case 'show_result':
			showData(msg.data);
			break;
	}
});


function showData(data) {
	$('body').prepend('<div class="atoka-div">' + JSON.stringify(data) + '</div>');
}