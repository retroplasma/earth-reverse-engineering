/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

goog.provide('proto.keyhole.QuadtreeLayer');
goog.provide('proto.keyhole.QuadtreeLayer.LayerType');

goog.require('jspb.Message');
goog.require('jspb.BinaryReader');
goog.require('jspb.BinaryWriter');
goog.require('proto.keyhole.QuadtreeImageryDates');


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
proto.keyhole.QuadtreeLayer = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.keyhole.QuadtreeLayer, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.keyhole.QuadtreeLayer.displayName = 'proto.keyhole.QuadtreeLayer';
}


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
proto.keyhole.QuadtreeLayer.prototype.toObject = function(opt_includeInstance) {
  return proto.keyhole.QuadtreeLayer.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.keyhole.QuadtreeLayer} msg The msg instance to transform.
 * @return {!Object}
 */
proto.keyhole.QuadtreeLayer.toObject = function(includeInstance, msg) {
  var f, obj = {
    type: jspb.Message.getField(msg, 1),
    layerEpoch: jspb.Message.getField(msg, 2),
    provider: jspb.Message.getField(msg, 3),
    datesLayer: (f = msg.getDatesLayer()) && proto.keyhole.QuadtreeImageryDates.toObject(includeInstance, f)
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
 * @return {!proto.keyhole.QuadtreeLayer}
 */
proto.keyhole.QuadtreeLayer.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.keyhole.QuadtreeLayer;
  return proto.keyhole.QuadtreeLayer.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.keyhole.QuadtreeLayer} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.keyhole.QuadtreeLayer}
 */
proto.keyhole.QuadtreeLayer.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.keyhole.QuadtreeLayer.LayerType} */ (reader.readEnum());
      msg.setType(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setLayerEpoch(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setProvider(value);
      break;
    case 4:
      var value = new proto.keyhole.QuadtreeImageryDates;
      reader.readMessage(value,proto.keyhole.QuadtreeImageryDates.deserializeBinaryFromReader);
      msg.setDatesLayer(value);
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
proto.keyhole.QuadtreeLayer.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.keyhole.QuadtreeLayer.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.keyhole.QuadtreeLayer} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.keyhole.QuadtreeLayer.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {!proto.keyhole.QuadtreeLayer.LayerType} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeInt32(
      3,
      f
    );
  }
  f = message.getDatesLayer();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.keyhole.QuadtreeImageryDates.serializeBinaryToWriter
    );
  }
};


/**
 * @enum {number}
 */
proto.keyhole.QuadtreeLayer.LayerType = {
  LAYER_TYPE_IMAGERY: 0,
  LAYER_TYPE_TERRAIN: 1,
  LAYER_TYPE_VECTOR: 2,
  LAYER_TYPE_IMAGERY_HISTORY: 3
};

/**
 * required LayerType type = 1;
 * @return {!proto.keyhole.QuadtreeLayer.LayerType}
 */
proto.keyhole.QuadtreeLayer.prototype.getType = function() {
  return /** @type {!proto.keyhole.QuadtreeLayer.LayerType} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {!proto.keyhole.QuadtreeLayer.LayerType} value */
proto.keyhole.QuadtreeLayer.prototype.setType = function(value) {
  jspb.Message.setField(this, 1, value);
};


proto.keyhole.QuadtreeLayer.prototype.clearType = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.QuadtreeLayer.prototype.hasType = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * required int32 layer_epoch = 2;
 * @return {number}
 */
proto.keyhole.QuadtreeLayer.prototype.getLayerEpoch = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.keyhole.QuadtreeLayer.prototype.setLayerEpoch = function(value) {
  jspb.Message.setField(this, 2, value);
};


proto.keyhole.QuadtreeLayer.prototype.clearLayerEpoch = function() {
  jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.QuadtreeLayer.prototype.hasLayerEpoch = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional int32 provider = 3;
 * @return {number}
 */
proto.keyhole.QuadtreeLayer.prototype.getProvider = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.keyhole.QuadtreeLayer.prototype.setProvider = function(value) {
  jspb.Message.setField(this, 3, value);
};


proto.keyhole.QuadtreeLayer.prototype.clearProvider = function() {
  jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.QuadtreeLayer.prototype.hasProvider = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional QuadtreeImageryDates dates_layer = 4;
 * @return {?proto.keyhole.QuadtreeImageryDates}
 */
proto.keyhole.QuadtreeLayer.prototype.getDatesLayer = function() {
  return /** @type{?proto.keyhole.QuadtreeImageryDates} */ (
    jspb.Message.getWrapperField(this, proto.keyhole.QuadtreeImageryDates, 4));
};


/** @param {?proto.keyhole.QuadtreeImageryDates|undefined} value */
proto.keyhole.QuadtreeLayer.prototype.setDatesLayer = function(value) {
  jspb.Message.setWrapperField(this, 4, value);
};


proto.keyhole.QuadtreeLayer.prototype.clearDatesLayer = function() {
  this.setDatesLayer(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.QuadtreeLayer.prototype.hasDatesLayer = function() {
  return jspb.Message.getField(this, 4) != null;
};


