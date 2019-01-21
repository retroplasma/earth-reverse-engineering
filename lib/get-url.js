"use strict"

const https = require('https');
const http = require('http');

module.exports = function getUrl(url) {
	return new Promise((resolve, reject) => {
		const chunks = [];
		(/^https:/.test(url) ? https : http).get(url, resp => {
			if (resp.statusCode !== 200) {
				reject(`Error: HTTP status code ${resp.statusCode} for ${url}`);
				return;
			}
			resp.on("data", d => chunks.push(d))
			    .on("end", () => resolve(Buffer.concat(chunks)))
			    .on("error", reject)
		}).on("error", reject);
	});
}
