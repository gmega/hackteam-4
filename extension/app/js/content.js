chrome.runtime.onMessage.addListener(function(msg, sender, callback) {
	switch(msg.text) {
		case 'get_page_info':
			callback({url: window.location.href, encoding: document.characterSet});
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
    var body = $('body'),
        spots = [],
        domainData = data.domainData,
        annotations = data.annotations,
        annotationNumber = annotations.length;

    var markup = `
        <div class='atoka-div'>
            <h3 class='title'><small>this page belongs to</small>${domainData['title']}</h3>
            <div>
                More info on <a href="${domainData.sameAs.atokaUri}" target="_blank">atoka.io</a>
            </div>
        </div>
    `;

    body.prepend(markup);

	if (annotationNumber > 0) {
		$('div.atoka-div').append("<span>Found on this page:</span><ul class='annotations'></ul>");
	}

	for (var i=0; i<annotationNumber; i++) {
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