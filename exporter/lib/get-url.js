"use strict"

const https = require('https');
const http = require('http');

module.exports = async function getUrl(url, autoRetry = true) {
	return await autoRetry
		? _autoRetry(() => _getUrl(url), function log(_, __, backOff) {
			console.error(`Retrying ${url} in ${backOff} ${backOff === 1 ? 'second' : 'seconds'}.`);
		}, function gaveUp(ex, tries, _) {
			console.error(`Gave up after ${tries} ${tries === 1 ? 'try' : 'tries'}.`);
			throw ex;
		})
		: _getUrl(url);
}

async function _getUrl(url) {
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

async function _autoRetry(fn, log = null, gaveUp = null, MAX_TRIES = 5, MAX_BACKOFF_SECS = 16) {
	for (let tries = 1, backOff = 1;; tries++, backOff = Math.min(2 * backOff, MAX_BACKOFF_SECS)) {
		try {
			return await fn();
		} catch (ex) {
			if (tries >= MAX_TRIES) return gaveUp && gaveUp(ex, tries, backOff);
			log && log(ex, tries, backOff);
			await new Promise((r, _) => setTimeout(r, 1000 * backOff));
		}
	}
}