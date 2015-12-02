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

		case 'show_error':
			showError(msg.data);
			break;

	}
});


function showError(data) {
	var markup = `
		<div class='atoka-div'>
			Sorry, something went wrong.
		</div>
	`;
	$('body').prepend(markup);
}

function showData(data, isError) {

	var domainData = data.domainData,
		annotations = data.annotations;

	var markup = `
		<div class='atoka-div'>
			<h3 class='title'>${domainData['title']}</h3>
			<div>
				More info on <a href="${domainData.sameAs.atokaUri}" target="_blank">atoka.io</a>
			</div>
			<ul class='annotations'></ul>
		</div>
	`;

	var spots = [];

	$('body').prepend(markup);

	for (var len=annotations.length, i=0; i<len; i++) {
		var current = annotations[i],
			wikipediaMarkup = '',
			dbpediaMarkup = '',
			atokaMarkup = '';

		spots += current.spot;

		if (current.sameAs.wikipediaUri) {
			wikipediaMarkup = `<a href="${current.sameAs.wikipediaUri}" target="_blank">Wikipedia</a>`;
		}

		if (current.sameAs.dbpediaUri) {
			dbpediaMarkup = `<a href="${current.sameAs.dbpediaUri}" target="_blank">DBPedia</a>`;
		}

		if (current.sameAs.atokaUri) {
			atokaMarkup = `<a href="${current.sameAs.atokaUri}" target="_blank">Atoka.io</a>`;
		}

		var annotation = `
			<li>
				<span class='spot'>${current.spot}</span>:
				${wikipediaMarkup} ${dbpediaMarkup} ${atokaMarkup}
			</li>
		`;
		$('.atoka-div .annotations').append(annotation);
	}

	$('body').highlight(spots);
}