// load frame
// then get inner document and query it

'use strict';

console.log("loading extension");

window.addEventListener('hashchange', function change (event) {
	console.log("url changed");
	console.log(event);
});

let iframe = document.getElementById('mainfs').children[1];
let domparser = new DOMParser();

iframe.addEventListener('load', function change (event) {
	try {
		'use strict';

		let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
		let testForm = Array.from(innerDoc.getElementsByTagName('form')).shift();

		if(!testForm) return;
		if(testForm.action.indexOf('sa2.lvanmelden') == -1) return;

		console.log('found a match');

		let table = Array.from(innerDoc.getElementsByClassName('list')).shift();
		let tablesItems = Array.from(table.getElementsByClassName('z1')).concat(Array.from(table.getElementsByClassName('z0')));

		let info = tablesItems.map((item) => {
			let link = Array.from(item.getElementsByTagName('a'))
							.filter((a) => { return a.target === 'lvdetail'})
							.shift();

			return [link.href, link.href.split("=")[1]];
		});

		console.log(info);

		let promises = info.map(([href, id]) => {
			return content.fetch(href)
					.then((response) => {
						return new Promise((resolve) => {
							response.text()
								.then((text) => {
									 resolve([text, id]);
								})
						});
					});
		});

		Promise.all(promises).then(result => console.log(result));
	}
	catch (e) {
		console.error(e);
	}
});

