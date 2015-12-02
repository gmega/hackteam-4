chrome.runtime.onMessage.addListener(function(msg, sender, callback) {
	switch(msg.text) {
		case 'get_page_url':
			callback(window.location.href);
			break;

		case 'show_result':
			showData(msg.data);
			break;

		case 'show_error':
			showError(msg.data);
			break;

		case 'remove':
			remove();
	}
});

function remove() {
	$('div.atoka-div').detach();
    $('body').unhighlight();
}

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
				More info on <a href="${domainData.sameAs.atokaUri}" target="_blank" class="atoka-href">atoka.io</a>
			</div>
			<ul class='annotations'></ul>
		</div>
	`;

	var spots = [];
    var body = $('body')

	body.prepend(markup);

	for (var len=annotations.length, i=0; i<len; i++) {
		var current = annotations[i],
			wikipediaMarkup = '',
			dbpediaMarkup = '',
			atokaMarkup = '';

		spots.push(current.spot);

		if (current.sameAs.wikipediaUri) {
			wikipediaMarkup = `<a href="${current.sameAs.wikipediaUri}" target="_blank" class="atoka-href">Wikipedia</a>`;
		}

		if (current.sameAs.dbpediaUri) {
			dbpediaMarkup = `<a href="${current.sameAs.dbpediaUri}" target="_blank" class="atoka-href">DBPedia</a>`;
		}

		if (current.sameAs.atokaUri) {
			atokaMarkup = `<a href="${current.sameAs.atokaUri}" target="_blank" class="atoka-href">Atoka.io</a>`;
		}

		var annotation = `
			<li>
				<span class='atoka-spot'>${current.spot}</span>:
				${wikipediaMarkup} ${dbpediaMarkup} ${atokaMarkup}
			</li>
		`;
		$('.atoka-div .annotations').append(annotation);
	}

	body.highlight(spots);
}