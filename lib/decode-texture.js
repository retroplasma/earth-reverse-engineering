const bmp = require('bmp-js');
const decodeDXT = require('decode-dxt');

module.exports = function decodeTexture(tex) {
	switch (tex.textureFormat) {
		// jpeg (saved as .jpg)
		case 1:
			return { extension: 'jpg' , buffer: new Buffer(tex.bytes) };
		// dxt1 (saved as .bmp)
		case 6:
			var bytes = tex.bytes
			var buf = new Buffer(bytes);
			var abuf = new Uint8Array(buf).buffer;
			var imageDataView = new DataView(abuf, 0, bytes.length);
			var rgbaData = decodeDXT(imageDataView, tex.width, tex.height, 'dxt1');
			var bmpData = [];

			// ABGR
			for (var i = 0; i < rgbaData.length; i += 4) {
				bmpData.push(255);
				bmpData.push(rgbaData[i + 2]);
				bmpData.push(rgbaData[i + 1]);
				bmpData.push(rgbaData[i + 0]);
			}

			var rawData = bmp.encode({
				data: bmpData, width: tex.width, height: tex.height,
			});
			
			return { extension: 'bmp', buffer: rawData.data }
		default:
			throw `unknown textureFormat ${tex.textureFormat}`
	}
}