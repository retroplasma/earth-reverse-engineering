"use strict"

const https = require('https');
const http = require('http');

module.exports = function getUrl(url) {
	return new Promise((resolve, reject) => {
		const chunks = [];
		(/^https:/.test(url) ? https : http).get(url, resp => resp
			.on("data", d => chunks.push(d))
			.on("end", () => resolve(Buffer.concat(chunks)))
			.on("error", reject)
		).on("error", reject);
	});
}