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
	var domainData = data.domainData,
		annotations = data.annotations;



	var markup = `
		<div class='atoka-div'>
			<div class='title'>${domainData['_source']['legalName']}</div>
			<div>
				More info on <a href="${domainData['_id']}">atoka.io</a>
			</div>
		</div>
	`;

	$('body').prepend(markup);
}