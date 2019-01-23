/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

goog.provide('proto.keyhole.replica.ReplicaDataPacket');
goog.provide('proto.keyhole.replica.ReplicaDataPacket.Codec');
goog.provide('proto.keyhole.replica.ReplicaDataPacket.Item');

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
proto.keyhole.replica.ReplicaDataPacket = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.keyhole.replica.ReplicaDataPacket.repeatedFields_, null);
};
goog.inherits(proto.keyhole.replica.ReplicaDataPacket, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.keyhole.replica.ReplicaDataPacket.displayName = 'proto.keyhole.replica.ReplicaDataPacket';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.keyhole.replica.ReplicaDataPacket.repeatedFields_ = [1];



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
proto.keyhole.replica.ReplicaDataPacket.prototype.toObject = function(opt_includeInstance) {
  return proto.keyhole.replica.ReplicaDataPacket.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.keyhole.replica.ReplicaDataPacket} msg The msg instance to transform.
 * @return {!Object}
 */
proto.keyhole.replica.ReplicaDataPacket.toObject = function(includeInstance, msg) {
  var f, obj = {
    itemsList: jspb.Message.toObjectList(msg.getItemsList(),
    proto.keyhole.replica.ReplicaDataPacket.Item.toObject, includeInstance)
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
 * @return {!proto.keyhole.replica.ReplicaDataPacket}
 */
proto.keyhole.replica.ReplicaDataPacket.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.keyhole.replica.ReplicaDataPacket;
  return proto.keyhole.replica.ReplicaDataPacket.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.keyhole.replica.ReplicaDataPacket} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.keyhole.replica.ReplicaDataPacket}
 */
proto.keyhole.replica.ReplicaDataPacket.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.keyhole.replica.ReplicaDataPacket.Item;
      reader.readMessage(value,proto.keyhole.replica.ReplicaDataPacket.Item.deserializeBinaryFromReader);
      msg.addItems(value);
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
proto.keyhole.replica.ReplicaDataPacket.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.keyhole.replica.ReplicaDataPacket.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.keyhole.replica.ReplicaDataPacket} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.keyhole.replica.ReplicaDataPacket.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getItemsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.keyhole.replica.ReplicaDataPacket.Item.serializeBinaryToWriter
    );
  }
};


/**
 * @enum {number}
 */
proto.keyhole.replica.ReplicaDataPacket.Codec = {
  NO_CODEC: 0,
  JP2: 1,
  DIO_GEOMETRY: 2,
  DDS: 3,
  SPT: 4,
  ZIPPED_SPT: 5,
  PNG: 6
};


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
proto.keyhole.replica.ReplicaDataPacket.Item = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.keyhole.replica.ReplicaDataPacket.Item, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.keyhole.replica.ReplicaDataPacket.Item.displayName = 'proto.keyhole.replica.ReplicaDataPacket.Item';
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
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.toObject = function(opt_includeInstance) {
  return proto.keyhole.replica.ReplicaDataPacket.Item.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.keyhole.replica.ReplicaDataPacket.Item} msg The msg instance to transform.
 * @return {!Object}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.toObject = function(includeInstance, msg) {
  var f, obj = {
    data: msg.getData_asB64(),
    codec: jspb.Message.getField(msg, 2),
    modelIndex: jspb.Message.getField(msg, 3),
    name: jspb.Message.getField(msg, 4),
    maximumDisplayDistance: jspb.Message.getField(msg, 5)
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
 * @return {!proto.keyhole.replica.ReplicaDataPacket.Item}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.keyhole.replica.ReplicaDataPacket.Item;
  return proto.keyhole.replica.ReplicaDataPacket.Item.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.keyhole.replica.ReplicaDataPacket.Item} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.keyhole.replica.ReplicaDataPacket.Item}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setData(value);
      break;
    case 2:
      var value = /** @type {!proto.keyhole.replica.ReplicaDataPacket.Codec} */ (reader.readEnum());
      msg.setCodec(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setModelIndex(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMaximumDisplayDistance(value);
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
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.keyhole.replica.ReplicaDataPacket.Item.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.keyhole.replica.ReplicaDataPacket.Item} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.keyhole.replica.ReplicaDataPacket.Item.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {!(string|Uint8Array)} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = /** @type {!proto.keyhole.replica.ReplicaDataPacket.Codec} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeEnum(
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
  f = /** @type {string} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeString(
      4,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 5));
  if (f != null) {
    writer.writeInt32(
      5,
      f
    );
  }
};


/**
 * required bytes data = 1;
 * @return {string}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.getData = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * required bytes data = 1;
 * This is a type-conversion wrapper around `getData()`
 * @return {string}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.getData_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getData()));
};


/**
 * required bytes data = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getData()`
 * @return {!Uint8Array}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.getData_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getData()));
};


/** @param {!(string|Uint8Array)} value */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.setData = function(value) {
  jspb.Message.setField(this, 1, value);
};


proto.keyhole.replica.ReplicaDataPacket.Item.prototype.clearData = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.hasData = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * required Codec codec = 2;
 * @return {!proto.keyhole.replica.ReplicaDataPacket.Codec}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.getCodec = function() {
  return /** @type {!proto.keyhole.replica.ReplicaDataPacket.Codec} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {!proto.keyhole.replica.ReplicaDataPacket.Codec} value */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.setCodec = function(value) {
  jspb.Message.setField(this, 2, value);
};


proto.keyhole.replica.ReplicaDataPacket.Item.prototype.clearCodec = function() {
  jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.hasCodec = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional int32 model_index = 3;
 * @return {number}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.getModelIndex = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/** @param {number} value */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.setModelIndex = function(value) {
  jspb.Message.setField(this, 3, value);
};


proto.keyhole.replica.ReplicaDataPacket.Item.prototype.clearModelIndex = function() {
  jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.hasModelIndex = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional string name = 4;
 * @return {string}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.setName = function(value) {
  jspb.Message.setField(this, 4, value);
};


proto.keyhole.replica.ReplicaDataPacket.Item.prototype.clearName = function() {
  jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.hasName = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional int32 maximum_display_distance = 5;
 * @return {number}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.getMaximumDisplayDistance = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/** @param {number} value */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.setMaximumDisplayDistance = function(value) {
  jspb.Message.setField(this, 5, value);
};


proto.keyhole.replica.ReplicaDataPacket.Item.prototype.clearMaximumDisplayDistance = function() {
  jspb.Message.setField(this, 5, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.replica.ReplicaDataPacket.Item.prototype.hasMaximumDisplayDistance = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * repeated Item items = 1;
 * If you change this array by adding, removing or replacing elements, or if you
 * replace the array itself, then you must call the setter to update it.
 * @return {!Array.<!proto.keyhole.replica.ReplicaDataPacket.Item>}
 */
proto.keyhole.replica.ReplicaDataPacket.prototype.getItemsList = function() {
  return /** @type{!Array.<!proto.keyhole.replica.ReplicaDataPacket.Item>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.keyhole.replica.ReplicaDataPacket.Item, 1));
};


/** @param {!Array.<!proto.keyhole.replica.ReplicaDataPacket.Item>} value */
proto.keyhole.replica.ReplicaDataPacket.prototype.setItemsList = function(value) {
  jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.keyhole.replica.ReplicaDataPacket.Item=} opt_value
 * @param {number=} opt_index
 * @return {!proto.keyhole.replica.ReplicaDataPacket.Item}
 */
proto.keyhole.replica.ReplicaDataPacket.prototype.addItems = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.keyhole.replica.ReplicaDataPacket.Item, opt_index);
};


proto.keyhole.replica.ReplicaDataPacket.prototype.clearItemsList = function() {
  this.setItemsList([]);
};


