/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

goog.provide('proto.geo_globetrotter_proto_rocktree.Texture');
goog.provide('proto.geo_globetrotter_proto_rocktree.Texture.Format');
goog.provide('proto.geo_globetrotter_proto_rocktree.Texture.ViewDirection');

goog.require('jspb.Message');
goog.require('jspb.BinaryReader');
goog.require('jspb.BinaryWriter');


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
proto.geo_globetrotter_proto_rocktree.Texture = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.geo_globetrotter_proto_rocktree.Texture.repeatedFields_, null);
};
goog.inherits(proto.geo_globetrotter_proto_rocktree.Texture, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.geo_globetrotter_proto_rocktree.Texture.displayName = 'proto.geo_globetrotter_proto_rocktree.Texture';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.geo_globetrotter_proto_rocktree.Texture.repeatedFields_ = [1];



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
proto.geo_globetrotter_proto_rocktree.Texture.prototype.toObject = function(opt_includeInstance) {
  return proto.geo_globetrotter_proto_rocktree.Texture.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.geo_globetrotter_proto_rocktree.Texture} msg The msg instance to transform.
 * @return {!Object}
 */
proto.geo_globetrotter_proto_rocktree.Texture.toObject = function(includeInstance, msg) {
  var f, obj = {
    dataList: msg.getDataList_asB64(),
    format: jspb.Message.getField(msg, 2),
    width: jspb.Message.getFieldWithDefault(msg, 3, 256),
    height: jspb.Message.getFieldWithDefault(msg, 4, 256),
    viewDirection: jspb.Message.getField(msg, 5),
    meshId: jspb.Message.getField(msg, 6)
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
 * @return {!proto.geo_globetrotter_proto_rocktree.Texture}
 */
proto.geo_globetrotter_proto_rocktree.Texture.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.geo_globetrotter_proto_rocktree.Texture;
  return proto.geo_globetrotter_proto_rocktree.Texture.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.geo_globetrotter_proto_rocktree.Texture} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.geo_globetrotter_proto_rocktree.Texture}
 */
proto.geo_globetrotter_proto_rocktree.Texture.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.addData(value);
      break;
    case 2:
      var value = /** @type {!proto.geo_globetrotter_proto_rocktree.Texture.Format} */ (reader.readEnum());
      msg.setFormat(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setWidth(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setHeight(value);
      break;
    case 5:
      var value = /** @type {!proto.geo_globetrotter_proto_rocktree.Texture.ViewDirection} */ (reader.readEnum());
      msg.setViewDirection(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setMeshId(value);
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
proto.geo_globetrotter_proto_rocktree.Texture.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.geo_globetrotter_proto_rocktree.Texture.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.geo_globetrotter_proto_rocktree.Texture} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.geo_globetrotter_proto_rocktree.Texture.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDataList_asU8();
  if (f.length > 0) {
    writer.writeRepeatedBytes(
      1,
      f
    );
  }
  f = /** @type {!proto.geo_globetrotter_proto_rocktree.Texture.Format} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeUint32(
      3,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeUint32(
      4,
      f
    );
  }
  f = /** @type {!proto.geo_globetrotter_proto_rocktree.Texture.ViewDirection} */ (jspb.Message.getField(message, 5));
  if (f != null) {
    writer.writeEnum(
      5,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 6));
  if (f != null) {
    writer.writeUint32(
      6,
      f
    );
  }
};


/**
 * @enum {number}
 */
proto.geo_globetrotter_proto_rocktree.Texture.Format = {
  JPG: 1,
  DXT1: 2,
  ETC1: 3,
  PVRTC2: 4,
  PVRTC4: 5,
  CRN_DXT1: 6
};

/**
 * @enum {number}
 */
proto.geo_globetrotter_proto_rocktree.Texture.ViewDirection = {
  NADIR: 0,
  NORTH_45: 1,
  EAST_45: 2,
  SOUTH_45: 3,
  WEST_45: 4
};

/**
 * repeated bytes data = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<string>}
 */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.getDataList = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.getField(this, 1));
};


/**
 * repeated bytes data = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * This is a type-conversion wrapper around `getDataList()`
 * @return {!Array.<string>}
 */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.getDataList_asB64 = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.bytesListAsB64(
      this.getDataList()));
};


/**
 * repeated bytes data = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getDataList()`
 * @return {!Array.<!Uint8Array>}
 */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.getDataList_asU8 = function() {
  return /** @type {!Array.<!Uint8Array>} */ (jspb.Message.bytesListAsU8(
      this.getDataList()));
};


/** @param {!(Array<!Uint8Array>|Array<string>)} value */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.setDataList = function(value) {
  jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.addData = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


proto.geo_globetrotter_proto_rocktree.Texture.prototype.clearDataList = function() {
  this.setDataList([]);
};


/**
 * optional Format format = 2;
 * @return {!proto.geo_globetrotter_proto_rocktree.Texture.Format}
 */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.getFormat = function() {
  return /** @type {!proto.geo_globetrotter_proto_rocktree.Texture.Format} */ (jspb.Message.getFieldWithDefault(this, 2, 1));
};


/** @param {!proto.geo_globetrotter_proto_rocktree.Texture.Format} value */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.setFormat = function(value) {
  jspb.Message.setField(this, 2, value);
};


proto.geo_globetrotter_proto_rocktree.Texture.prototype.clearFormat = function() {
  jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.hasFormat = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional uint32 width = 3;
 * @return {number}
 */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.getWidth = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 256));
};


/** @param {number} value */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.setWidth = function(value) {
  jspb.Message.setField(this, 3, value);
};


proto.geo_globetrotter_proto_rocktree.Texture.prototype.clearWidth = function() {
  jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.hasWidth = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional uint32 height = 4;
 * @return {number}
 */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.getHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 4, 256));
};


/** @param {number} value */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.setHeight = function(value) {
  jspb.Message.setField(this, 4, value);
};


proto.geo_globetrotter_proto_rocktree.Texture.prototype.clearHeight = function() {
  jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.hasHeight = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional ViewDirection view_direction = 5;
 * @return {!proto.geo_globetrotter_proto_rocktree.Texture.ViewDirection}
 */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.getViewDirection = function() {
  return /** @type {!proto.geo_globetrotter_proto_rocktree.Texture.ViewDirection} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/** @param {!proto.geo_globetrotter_proto_rocktree.Texture.ViewDirection} value */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.setViewDirection = function(value) {
  jspb.Message.setField(this, 5, value);
};


proto.geo_globetrotter_proto_rocktree.Texture.prototype.clearViewDirection = function() {
  jspb.Message.setField(this, 5, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.hasViewDirection = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional uint32 mesh_id = 6;
 * @return {number}
 */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.getMeshId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/** @param {number} value */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.setMeshId = function(value) {
  jspb.Message.setField(this, 6, value);
};


proto.geo_globetrotter_proto_rocktree.Texture.prototype.clearMeshId = function() {
  jspb.Message.setField(this, 6, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.geo_globetrotter_proto_rocktree.Texture.prototype.hasMeshId = function() {
  return jspb.Message.getField(this, 6) != null;
};


