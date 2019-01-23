/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

goog.provide('proto.geo_globetrotter_proto_rocktree.Mesh');
goog.provide('proto.geo_globetrotter_proto_rocktree.Mesh.Layer');
goog.provide('proto.geo_globetrotter_proto_rocktree.Mesh.LayerMask');

goog.require('jspb.Message');
goog.require('jspb.BinaryReader');
goog.require('jspb.BinaryWriter');
goog.require('proto.geo_globetrotter_proto_rocktree.Texture');


/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.geo_globetrotter_proto_rocktree.Mesh = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.geo_globetrotter_proto_rocktree.Mesh.repeatedFields_, null);
};
goog.inherits(proto.geo_globetrotter_proto_rocktree.Mesh, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.geo_globetrotter_proto_rocktree.Mesh.displayName = 'proto.geo_globetrotter_proto_rocktree.Mesh';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.geo_globetrotter_proto_rocktree.Mesh.repeatedFields_ = [6,10];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.toObject = function(opt_includeInstance) {
  return proto.geo_globetrotter_proto_rocktree.Mesh.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.geo_globetrotter_proto_rocktree.Mesh} msg The msg instance to transform.
 * @return {!Object}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.toObject = function(includeInstance, msg) {
  var f, obj = {
    vertices: msg.getVertices_asB64(),
    vertexAlphas: msg.getVertexAlphas_asB64(),
    textureCoords: msg.getTextureCoords_asB64(),
    indices: msg.getIndices_asB64(),
    octantRanges: msg.getOctantRanges_asB64(),
    layerCounts: msg.getLayerCounts_asB64(),
    textureList: jspb.Message.toObjectList(msg.getTextureList(),
    proto.geo_globetrotter_proto_rocktree.Texture.toObject, includeInstance),
    textureCoordinates: msg.getTextureCoordinates_asB64(),
    uvOffsetAndScaleList: jspb.Message.getRepeatedFloatingPointField(msg, 10),
    layerAndOctantCounts: msg.getLayerAndOctantCounts_asB64(),
    normals: msg.getNormals_asB64(),
    normalsDev: msg.getNormalsDev_asB64(),
    meshId: jspb.Message.getField(msg, 12),
    skirtFlags: msg.getSkirtFlags_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.geo_globetrotter_proto_rocktree.Mesh}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.geo_globetrotter_proto_rocktree.Mesh;
  return proto.geo_globetrotter_proto_rocktree.Mesh.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.geo_globetrotter_proto_rocktree.Mesh} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.geo_globetrotter_proto_rocktree.Mesh}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setVertices(value);
      break;
    case 9:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setVertexAlphas(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setTextureCoords(value);
      break;
    case 3:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setIndices(value);
      break;
    case 4:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setOctantRanges(value);
      break;
    case 5:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setLayerCounts(value);
      break;
    case 6:
      var value = new proto.geo_globetrotter_proto_rocktree.Texture;
      reader.readMessage(value,proto.geo_globetrotter_proto_rocktree.Texture.deserializeBinaryFromReader);
      msg.addTexture(value);
      break;
    case 7:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setTextureCoordinates(value);
      break;
    case 10:
      var value = /** @type {!Array.<number>} */ (reader.readPackedFloat());
      msg.setUvOffsetAndScaleList(value);
      break;
    case 8:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setLayerAndOctantCounts(value);
      break;
    case 11:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setNormals(value);
      break;
    case 16:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setNormalsDev(value);
      break;
    case 12:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setMeshId(value);
      break;
    case 13:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setSkirtFlags(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.geo_globetrotter_proto_rocktree.Mesh.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.geo_globetrotter_proto_rocktree.Mesh} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.geo_globetrotter_proto_rocktree.Mesh.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 9));
  if (f != null) {
    writer.writeBytes(
      9,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeBytes(
      2,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeBytes(
      3,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeBytes(
      4,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 5));
  if (f != null) {
    writer.writeBytes(
      5,
      f
    );
  }
  f = message.getTextureList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      6,
      f,
      proto.geo_globetrotter_proto_rocktree.Texture.serializeBinaryToWriter
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 7));
  if (f != null) {
    writer.writeBytes(
      7,
      f
    );
  }
  f = message.getUvOffsetAndScaleList();
  if (f.length > 0) {
    writer.writePackedFloat(
      10,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 8));
  if (f != null) {
    writer.writeBytes(
      8,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 11));
  if (f != null) {
    writer.writeBytes(
      11,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 16));
  if (f != null) {
    writer.writeBytes(
      16,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 12));
  if (f != null) {
    writer.writeUint32(
      12,
      f
    );
  }
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 13));
  if (f != null) {
    writer.writeBytes(
      13,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.Layer = {
  OVERGROUND: 0,
  TERRAIN_BELOW_WATER: 1,
  TERRAIN_ABOVE_WATER: 2,
  TERRAIN_HIDDEN: 3,
  WATER: 4,
  WATER_SKIRTS: 5,
  WATER_SKIRTS_INVERTED: 6,
  OVERLAY_SURFACE: 7,
  OVERLAY_SURFACE_SKIRTS: 8,
  NUM_LAYERS: 9
};

/**
 * @enum {number}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.LayerMask = {
  TERRAIN_WITH_OVERGROUND: 7,
  TERRAIN_WITH_WATER: 28,
  TERRAIN_WITHOUT_WATER: 14
};

/**
 * optional bytes vertices = 1;
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getVertices = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes vertices = 1;
 * This is a type-conversion wrapper around `getVertices()`
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getVertices_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getVertices()));
};


/**
 * optional bytes vertices = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getVertices()`
 * @return {!Uint8Array}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getVertices_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getVertices()));
};


/** @param {!(string|Uint8Array)} value */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.setVertices = function(value) {
  jspb.Message.setField(this, 1, value);
};


proto.geo_globetrotter_proto_rocktree.Mesh.prototype.clearVertices = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.hasVertices = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional bytes vertex_alphas = 9;
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getVertexAlphas = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 9, ""));
};


/**
 * optional bytes vertex_alphas = 9;
 * This is a type-conversion wrapper around `getVertexAlphas()`
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getVertexAlphas_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getVertexAlphas()));
};


/**
 * optional bytes vertex_alphas = 9;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getVertexAlphas()`
 * @return {!Uint8Array}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getVertexAlphas_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getVertexAlphas()));
};


/** @param {!(string|Uint8Array)} value */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.setVertexAlphas = function(value) {
  jspb.Message.setField(this, 9, value);
};


proto.geo_globetrotter_proto_rocktree.Mesh.prototype.clearVertexAlphas = function() {
  jspb.Message.setField(this, 9, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.hasVertexAlphas = function() {
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional bytes texture_coords = 2;
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getTextureCoords = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes texture_coords = 2;
 * This is a type-conversion wrapper around `getTextureCoords()`
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getTextureCoords_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getTextureCoords()));
};


/**
 * optional bytes texture_coords = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTextureCoords()`
 * @return {!Uint8Array}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getTextureCoords_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getTextureCoords()));
};


/** @param {!(string|Uint8Array)} value */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.setTextureCoords = function(value) {
  jspb.Message.setField(this, 2, value);
};


proto.geo_globetrotter_proto_rocktree.Mesh.prototype.clearTextureCoords = function() {
  jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.hasTextureCoords = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional bytes indices = 3;
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getIndices = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * optional bytes indices = 3;
 * This is a type-conversion wrapper around `getIndices()`
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getIndices_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getIndices()));
};


/**
 * optional bytes indices = 3;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getIndices()`
 * @return {!Uint8Array}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getIndices_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getIndices()));
};


/** @param {!(string|Uint8Array)} value */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.setIndices = function(value) {
  jspb.Message.setField(this, 3, value);
};


proto.geo_globetrotter_proto_rocktree.Mesh.prototype.clearIndices = function() {
  jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.hasIndices = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional bytes octant_ranges = 4;
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getOctantRanges = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * optional bytes octant_ranges = 4;
 * This is a type-conversion wrapper around `getOctantRanges()`
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getOctantRanges_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getOctantRanges()));
};


/**
 * optional bytes octant_ranges = 4;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getOctantRanges()`
 * @return {!Uint8Array}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getOctantRanges_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getOctantRanges()));
};


/** @param {!(string|Uint8Array)} value */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.setOctantRanges = function(value) {
  jspb.Message.setField(this, 4, value);
};


proto.geo_globetrotter_proto_rocktree.Mesh.prototype.clearOctantRanges = function() {
  jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.hasOctantRanges = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional bytes layer_counts = 5;
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getLayerCounts = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * optional bytes layer_counts = 5;
 * This is a type-conversion wrapper around `getLayerCounts()`
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getLayerCounts_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getLayerCounts()));
};


/**
 * optional bytes layer_counts = 5;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getLayerCounts()`
 * @return {!Uint8Array}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getLayerCounts_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getLayerCounts()));
};


/** @param {!(string|Uint8Array)} value */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.setLayerCounts = function(value) {
  jspb.Message.setField(this, 5, value);
};


proto.geo_globetrotter_proto_rocktree.Mesh.prototype.clearLayerCounts = function() {
  jspb.Message.setField(this, 5, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.hasLayerCounts = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * repeated Texture texture = 6;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.geo_globetrotter_proto_rocktree.Texture>}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getTextureList = function() {
  return /** @type{!Array.<!proto.geo_globetrotter_proto_rocktree.Texture>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.geo_globetrotter_proto_rocktree.Texture, 6));
};


/** @param {!Array.<!proto.geo_globetrotter_proto_rocktree.Texture>} value */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.setTextureList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 6, value);
};


/**
 * @param {!proto.geo_globetrotter_proto_rocktree.Texture=} opt_value
 * @param {number=} opt_index
 * @return {!proto.geo_globetrotter_proto_rocktree.Texture}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.addTexture = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 6, opt_value, proto.geo_globetrotter_proto_rocktree.Texture, opt_index);
};


proto.geo_globetrotter_proto_rocktree.Mesh.prototype.clearTextureList = function() {
  this.setTextureList([]);
};


/**
 * optional bytes texture_coordinates = 7;
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getTextureCoordinates = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * optional bytes texture_coordinates = 7;
 * This is a type-conversion wrapper around `getTextureCoordinates()`
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getTextureCoordinates_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getTextureCoordinates()));
};


/**
 * optional bytes texture_coordinates = 7;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTextureCoordinates()`
 * @return {!Uint8Array}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getTextureCoordinates_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getTextureCoordinates()));
};


/** @param {!(string|Uint8Array)} value */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.setTextureCoordinates = function(value) {
  jspb.Message.setField(this, 7, value);
};


proto.geo_globetrotter_proto_rocktree.Mesh.prototype.clearTextureCoordinates = function() {
  jspb.Message.setField(this, 7, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.hasTextureCoordinates = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * repeated float uv_offset_and_scale = 10;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<number>}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getUvOffsetAndScaleList = function() {
  return /** @type {!Array.<number>} */ (jspb.Message.getRepeatedFloatingPointField(this, 10));
};


/** @param {!Array.<number>} value */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.setUvOffsetAndScaleList = function(value) {
  jspb.Message.setField(this, 10, value || []);
};


/**
 * @param {!number} value
 * @param {number=} opt_index
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.addUvOffsetAndScale = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 10, value, opt_index);
};


proto.geo_globetrotter_proto_rocktree.Mesh.prototype.clearUvOffsetAndScaleList = function() {
  this.setUvOffsetAndScaleList([]);
};


/**
 * optional bytes layer_and_octant_counts = 8;
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getLayerAndOctantCounts = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * optional bytes layer_and_octant_counts = 8;
 * This is a type-conversion wrapper around `getLayerAndOctantCounts()`
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getLayerAndOctantCounts_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getLayerAndOctantCounts()));
};


/**
 * optional bytes layer_and_octant_counts = 8;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getLayerAndOctantCounts()`
 * @return {!Uint8Array}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getLayerAndOctantCounts_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getLayerAndOctantCounts()));
};


/** @param {!(string|Uint8Array)} value */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.setLayerAndOctantCounts = function(value) {
  jspb.Message.setField(this, 8, value);
};


proto.geo_globetrotter_proto_rocktree.Mesh.prototype.clearLayerAndOctantCounts = function() {
  jspb.Message.setField(this, 8, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.hasLayerAndOctantCounts = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional bytes normals = 11;
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getNormals = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 11, ""));
};


/**
 * optional bytes normals = 11;
 * This is a type-conversion wrapper around `getNormals()`
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getNormals_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getNormals()));
};


/**
 * optional bytes normals = 11;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getNormals()`
 * @return {!Uint8Array}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getNormals_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getNormals()));
};


/** @param {!(string|Uint8Array)} value */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.setNormals = function(value) {
  jspb.Message.setField(this, 11, value);
};


proto.geo_globetrotter_proto_rocktree.Mesh.prototype.clearNormals = function() {
  jspb.Message.setField(this, 11, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.hasNormals = function() {
  return jspb.Message.getField(this, 11) != null;
};


/**
 * optional bytes normals_dev = 16;
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getNormalsDev = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 16, ""));
};


/**
 * optional bytes normals_dev = 16;
 * This is a type-conversion wrapper around `getNormalsDev()`
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getNormalsDev_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getNormalsDev()));
};


/**
 * optional bytes normals_dev = 16;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getNormalsDev()`
 * @return {!Uint8Array}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getNormalsDev_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getNormalsDev()));
};


/** @param {!(string|Uint8Array)} value */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.setNormalsDev = function(value) {
  jspb.Message.setField(this, 16, value);
};


proto.geo_globetrotter_proto_rocktree.Mesh.prototype.clearNormalsDev = function() {
  jspb.Message.setField(this, 16, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.hasNormalsDev = function() {
  return jspb.Message.getField(this, 16) != null;
};


/**
 * optional uint32 mesh_id = 12;
 * @return {number}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getMeshId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 12, 0));
};


/** @param {number} value */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.setMeshId = function(value) {
  jspb.Message.setField(this, 12, value);
};


proto.geo_globetrotter_proto_rocktree.Mesh.prototype.clearMeshId = function() {
  jspb.Message.setField(this, 12, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.hasMeshId = function() {
  return jspb.Message.getField(this, 12) != null;
};


/**
 * optional bytes skirt_flags = 13;
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getSkirtFlags = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 13, ""));
};


/**
 * optional bytes skirt_flags = 13;
 * This is a type-conversion wrapper around `getSkirtFlags()`
 * @return {string}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getSkirtFlags_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getSkirtFlags()));
};


/**
 * optional bytes skirt_flags = 13;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getSkirtFlags()`
 * @return {!Uint8Array}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.getSkirtFlags_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getSkirtFlags()));
};


/** @param {!(string|Uint8Array)} value */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.setSkirtFlags = function(value) {
  jspb.Message.setField(this, 13, value);
};


proto.geo_globetrotter_proto_rocktree.Mesh.prototype.clearSkirtFlags = function() {
  jspb.Message.setField(this, 13, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Mesh.prototype.hasSkirtFlags = function() {
  return jspb.Message.getField(this, 13) != null;
};


