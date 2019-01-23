/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

goog.provide('proto.keyhole.dbroot.SwoopParamsProto');

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
proto.keyhole.dbroot.SwoopParamsProto = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.keyhole.dbroot.SwoopParamsProto, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.keyhole.dbroot.SwoopParamsProto.displayName = 'proto.keyhole.dbroot.SwoopParamsProto';
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
proto.keyhole.dbroot.SwoopParamsProto.prototype.toObject = function(opt_includeInstance) {
  return proto.keyhole.dbroot.SwoopParamsProto.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.keyhole.dbroot.SwoopParamsProto} msg The msg instance to transform.
 * @return {!Object}
 */
proto.keyhole.dbroot.SwoopParamsProto.toObject = function(includeInstance, msg) {
  var f, obj = {
    startDistInMeters: jspb.Message.getOptionalFloatingPointField(msg, 1)
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
 * @return {!proto.keyhole.dbroot.SwoopParamsProto}
 */
proto.keyhole.dbroot.SwoopParamsProto.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.keyhole.dbroot.SwoopParamsProto;
  return proto.keyhole.dbroot.SwoopParamsProto.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.keyhole.dbroot.SwoopParamsProto} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.keyhole.dbroot.SwoopParamsProto}
 */
proto.keyhole.dbroot.SwoopParamsProto.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readDouble());
      msg.setStartDistInMeters(value);
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
proto.keyhole.dbroot.SwoopParamsProto.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.keyhole.dbroot.SwoopParamsProto.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.keyhole.dbroot.SwoopParamsProto} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.keyhole.dbroot.SwoopParamsProto.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {number} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeDouble(
      1,
      f
    );
  }
};


/**
 * optional double start_dist_in_meters = 1;
 * @return {number}
 */
proto.keyhole.dbroot.SwoopParamsProto.prototype.getStartDistInMeters = function() {
  return /** @type {number} */ (+jspb.Message.getFieldWithDefault(this, 1, 0.0));
};


/** @param {number} value */
proto.keyhole.dbroot.SwoopParamsProto.prototype.setStartDistInMeters = function(value) {
  jspb.Message.setField(this, 1, value);
};


proto.keyhole.dbroot.SwoopParamsProto.prototype.clearStartDistInMeters = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.dbroot.SwoopParamsProto.prototype.hasStartDistInMeters = function() {
  return jspb.Message.getField(this, 1) != null;
};


