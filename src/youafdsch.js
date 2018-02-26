// load frame
// then get inner document and query it

'use strict';

console.log("loading extension");

window.addEventListener('hashchange', function change (event) {
	console.log("url changed");
	console.log(event);
});

let iframe = document.getElementById('mainfs').children[1];
const domparser = new DOMParser();

iframe.addEventListener('load', function change (event) {
	try {
		'use strict';

		// a.querySelectorAll('table.list tr')

		const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
		const items = Array.from(innerDoc.querySelectorAll('table.list tr'));
		
		if(items.length == 0) return;

		console.log('found a match');

		// [[[url, id]...], node], ...]
		const sortedItems = items.reduce((acc, item) => {
			if(item.classList.contains('z0') || item.classList.contains('z1')) {
				const link = Array.from(item.getElementsByTagName('a'))
									.filter((a) => a.target === 'lvdetail')
									.shift();
				acc[acc.length - 1][0].push([link.href, link.href.split("=")[1]]);
				return acc;
			}
			if(item.classList.length == 0 && (item.textContent == String.fromCharCode(160) || item.firstElementChild.textContent == String.fromCharCode(160))) {
				acc[acc.length - 1][1] = item;
				acc.push([[],]);
				return acc;
			}
			return acc;
		}, [[[]]])
		.filter(item => item[0].length != 0);

		console.log(sortedItems);

		const promises = sortedItems.map((outer) => {
			console.log(outer);
			const [items, node] = outer;
			console.log(items);
			const _items = items.map(([href, id]) => {
				return content.fetch(href)
						.then((response) => {
							return new Promise((resolve) => {
								response.text()
								.then((text) => {
									resolve([
										domparser.parseFromString(text, "text/html"),
										id
									]);
								})
							})
						})
			});

			return [_items, node];
		});

		console.log(promises[0][0]);


		Promise.all(promises[0][0]).then(result => {
			console.log(result);
		});
	}
	catch (e) {
		console.error(e);
	}
});

