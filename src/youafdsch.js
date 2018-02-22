// load frame
// then get inner document and query it

'use strict';

console.log("loading extension");

let iframe = document.getElementById('mainfs').children[1];

let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
let tablesItems = Array.from(innerDoc.getElementsByClassName('z1')).concat(Array.from(innerDoc.getElementsByClassName('z0')));

console.log(tablesItems);

let info = tablesItems.map((item) => {
	let link = Array.from(item.getElementsByTagName('a'))
					.filter((a) => { console.log(a.target); return a.target === 'lvdetail'})
					.shift();

	return link;

});

console.log(info);