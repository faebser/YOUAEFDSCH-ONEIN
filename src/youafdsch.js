// load frame
// then get inner document and query it

'use strict';

console.log("loading extension");

let iframe = document.getElementById('mainfs').children[1];
const domparser = new DOMParser();
const storage = localStorage;
const debug = true;
const _log = console.log;

console.log = function(input) {
	if(debug) _log(input);
}

Array.prototype.pluck = function() {
	console.log(this);
	return this;
};

Array.prototype.uniq = function() {
	try {
	if (this.length === 1 || this.length === 0) return this;
	return this.reduce((acc, [text, item]) => {
		if(acc.length == 0) {
			acc.push([text, item]);
			return acc;
		}
		if(acc[acc.length - 1][0] != text) {
			acc.push([text, item]);
			return acc;
		}
		return acc;

	}, []);
	}
	catch (e) {
		console.error(e);
	}
};

iframe.addEventListener('load', function change (event) {
	try {
		'use strict';

		const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
		const items = Array.from(innerDoc.querySelectorAll('table.list tr'));
		
		if(items.length == 0) return;

		console.log('found a match');

		// removing the huren on click

		Array.from(innerDoc.querySelectorAll('table.list tr a[href*="wbLv.wbShowLVDetail"]'))
			.forEach((element) => {
				console.log(element.getAttribute('onclick'));
				element.removeAttribute('onclick');
				element.addEventListener('onclick', () => true);
				//element.setAttribute('target', '_blank');
			});

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
			const [items, node] = outer;
			const _items = items.map(([href, id]) => {
				// try to get result from storage
				// 
				const result = storage.getItem(id);
				if(result !== null) {
					return new Promise((resolve) => {
						resolve([parseInt(result), id]);
					});
				}
				return content.fetch(href)
						.then((response) => {
							return new Promise((resolve) => {
								response.text()
								.then((text) => {
									// parse here
									console.log('id', id);
									const html = domparser.parseFromString(text, "text/html");
									const result = Array.from(html.querySelectorAll('table.cotable .coRow.hi'))
										.map((table_item) => {
											return [table_item.firstElementChild.textContent,  table_item.children[5].textContent];
										})
										.filter(([text, _points]) => {
											return text.indexOf('Interface Cultures') != -1
										})
										.uniq()
										.reduce((sum, [_text, points]) => {
											return sum + parseInt(points);
										}, 0);

										// sum is still 0
										// lets see if it is a freifach
									storage.setItem(id, result);
										
									// resolve to ects points result
									resolve([
										result,
										id
									]);
								});
							});
						});
			});
			return [_items, node];
		});

		console.log("stuff");

		console.log(promises[0][0]);

		promises.forEach(([promises, node]) => {
			Promise.all(promises).then(result => {
				node.textContent = result.reduce((sum, [points, _id]) => sum + points, 0)
			})
		});
	}
	catch (e) {
		console.error(e);
	}
});

