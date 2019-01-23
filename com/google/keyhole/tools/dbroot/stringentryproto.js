/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

goog.provide('proto.keyhole.dbroot.StringEntryProto');

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
proto.keyhole.dbroot.StringEntryProto = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.keyhole.dbroot.StringEntryProto, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.keyhole.dbroot.StringEntryProto.displayName = 'proto.keyhole.dbroot.StringEntryProto';
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
proto.keyhole.dbroot.StringEntryProto.prototype.toObject = function(opt_includeInstance) {
  return proto.keyhole.dbroot.StringEntryProto.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.keyhole.dbroot.StringEntryProto} msg The msg instance to transform.
 * @return {!Object}
 */
proto.keyhole.dbroot.StringEntryProto.toObject = function(includeInstance, msg) {
  var f, obj = {
    stringId: jspb.Message.getField(msg, 1),
    stringValue: jspb.Message.getField(msg, 2)
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
 * @return {!proto.keyhole.dbroot.StringEntryProto}
 */
proto.keyhole.dbroot.StringEntryProto.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.keyhole.dbroot.StringEntryProto;
  return proto.keyhole.dbroot.StringEntryProto.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.keyhole.dbroot.StringEntryProto} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.keyhole.dbroot.StringEntryProto}
 */
proto.keyhole.dbroot.StringEntryProto.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readFixed32());
      msg.setStringId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setStringValue(value);
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
proto.keyhole.dbroot.StringEntryProto.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.keyhole.dbroot.StringEntryProto.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.keyhole.dbroot.StringEntryProto} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.keyhole.dbroot.StringEntryProto.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {number} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeFixed32(
      1,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 2));
  if (f != null) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * required fixed32 string_id = 1;
 * @return {number}
 */
proto.keyhole.dbroot.StringEntryProto.prototype.getStringId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.keyhole.dbroot.StringEntryProto.prototype.setStringId = function(value) {
  jspb.Message.setField(this, 1, value);
};


proto.keyhole.dbroot.StringEntryProto.prototype.clearStringId = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.dbroot.StringEntryProto.prototype.hasStringId = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * required string string_value = 2;
 * @return {string}
 */
proto.keyhole.dbroot.StringEntryProto.prototype.getStringValue = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.keyhole.dbroot.StringEntryProto.prototype.setStringValue = function(value) {
  jspb.Message.setField(this, 2, value);
};


proto.keyhole.dbroot.StringEntryProto.prototype.clearStringValue = function() {
  jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.dbroot.StringEntryProto.prototype.hasStringValue = function() {
  return jspb.Message.getField(this, 2) != null;
};


