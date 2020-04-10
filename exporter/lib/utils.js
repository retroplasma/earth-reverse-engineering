"use strict";

const fs = require('fs-extra');
const path = require('path');
const getUrl = require('./get-url');
const decodeResource = require('./decode-resource');

// protobuf decoding constants
const [CMD_BULK, CMD_NODE] = [0, 3];

module.exports = function init(config) {
	const { URL_PREFIX, DUMP_JSON_DIR, DUMP_RAW_DIR, DUMP_JSON, DUMP_RAW } = config;

	DUMP_JSON && fs.ensureDirSync(DUMP_JSON_DIR);
	DUMP_RAW && fs.ensureDirSync(DUMP_RAW_DIR);

	const utils = {

		bulk: {
			// checks if element at index has a node
			hasNodeAtIndex(bulk, index) {
				return !(bulk.flags[index] & 8);
			},

			// checks if element at index has bulk metadata
			// expects index to point at bulk metadata candidate
			hasBulkMetadataAtIndex(bulk, index) {
				return !!(bulk.flags[index] & 4);
			},

			// get index by path
			// it accepts the whole or relative octant path
			getIndexByPath(bulk, path) {
				let c = -1;
				for (let e = path, f = (e.length - 1) - ((e.length - 1) % 4); f < e.length; ++f)
					c = bulk.childIndices[8 * (c + 1) + (e.charCodeAt(f) - 48)];
				return c;
			},

			// get relative octant path by index
			getPathByIndex(bulk, index) {
				let [first] = utils.bulk.allPaths(bulk, i => i === index, true);
				if (first === undefined) {
					first = null;
				}
				return first;
			},

			// returns all paths in bulk (dirty method)
			// also accepts filter
			allPaths(bulk, filter = _ => true, stopAfterFirst = false) {
				let result = [];
				function next(oct, max) {
					if (oct.length === max) return;
					for (const nxt of [0, 1, 2, 3, 4, 5, 6, 7].map(a => a.toString())) {
						const cur = oct + nxt;
						const i = utils.bulk.getIndexByPath(bulk, cur);
						if (i < 0) continue;
						if (filter(i)) {
							result.push(cur);
							if (stopAfterFirst) return;
						}
						next(cur, max)
					}
				}
				next("", 4);
				return result;
			},
		},

		async getNode(path, bulk, index) {

			const nodeEpoch = bulk.epoch[index];
			const nodeImgEpoch = bulk.imageryEpochArray ? bulk.imageryEpochArray[index] : bulk.defaultImageryEpoch;
			const nodeTexFormat = bulk.textureFormatArray ? bulk.textureFormatArray[index] : bulk.defaultTextureFormat;
			const nodeFlags = bulk.flags[index];

			const imgEpochPart = nodeFlags & 16 ? `!3u${nodeImgEpoch}` : '';
			const url = `!1m2!1s${path}!2u${nodeEpoch}!2e${nodeTexFormat}${imgEpochPart}!4b0`

			return await decode(CMD_NODE, `NodeData/pb=${url}`, false);
		},

		async getPlanetoid() {
			return await decode(CMD_BULK, `PlanetoidMetadata`);
		},

		async getBulk(path, epoch) {
			return await decode(CMD_BULK, `BulkMetadata/pb=!1m2!1s${path}!2u${epoch}`);
		},

	};

	const CACHE_ENABLED = true;
	const cache = {};
	const requests = {};

	// download and decode map data
	async function decode(command, url, useMemoryCache = true) {

		if (useMemoryCache && CACHE_ENABLED && cache[url]) {
			return cache[url];
		}

		if (requests[url]) {
			// deduplicate parallel downloads
			return await new Promise(function (resolve, reject) {
				requests[url].push({ resolve, reject });
			});
		};

		requests[url] = [];

		let res;
		try {
			const payload = await getUrl(`${URL_PREFIX}${url}`);
			const data = await decodeResource(command, payload);
			res = data.payload;

			if (useMemoryCache && CACHE_ENABLED) {
				cache[url] = res;
			}

			const fn = url.replace('/pb=', '');
			DUMP_JSON && fs.writeFileSync(path.join(DUMP_JSON_DIR, `${fn}.json`), JSON.stringify(res, null, 2));
			DUMP_RAW && fs.writeFileSync(path.join(DUMP_RAW_DIR, `${fn}.raw`), payload);
		} catch (ex) {
			requests[url].forEach(p => p.reject(ex));
			delete requests[url];
			throw ex;
		}

		requests[url].forEach(p => p.resolve(res));
		delete requests[url];

		return res;
	}

	return utils;
}
