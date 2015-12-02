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
    remove();

    var body = $('body'),
        spots = [],
        domainData = data.domainData,
        annotations = data.annotations,
        annotationNumber = annotations.length;

    var economicsInfo = '';
    if ('economics' in domainData && 'revenue' in domainData.economics) {
        economicsInfo = `<li>Last revenues: ${domainData.economics.revenue}€</li>`;
    }

    var atecoInfo = '';
    if ('atecoLabel' in domainData) {
        atecoInfo = `${domainData['atecoLabel']}`;
    }

    var employeesInfo = '';
    if ('numberOfEmployees' in domainData) {
        employeesInfo = `<li>Number of Employees: ${domainData['numberOfEmployees']}</li>`;
    }

    var markup = `
        <div class='atoka-div'>
            <small class="small">We think this page belongs to</small>
            <h3 class='title'>${domainData['title']}</h3>
            <small class="small">${atecoInfo}</small>

            <div class='more-info'>
                <ul>
                    ${economicsInfo}
                    ${employeesInfo}
                    <li>More info on <a href="${domainData.sameAs.atokaUri}" target="_blank">atoka.io</a></li>
                </ul>
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
                ${current.title} mentioned as 
				<span class='atoka-spot'>${current.spot}</span>
				${wikipediaMarkup} ${dbpediaMarkup} ${atokaMarkup}
			</li>
		`;
		$('.atoka-div .annotations').append(annotation);
	}

	body.highlight(spots);
}