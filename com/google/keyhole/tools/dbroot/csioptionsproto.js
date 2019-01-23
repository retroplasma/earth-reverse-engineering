/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

goog.provide('proto.keyhole.dbroot.CSIOptionsProto');

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
proto.keyhole.dbroot.CSIOptionsProto = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.keyhole.dbroot.CSIOptionsProto, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.keyhole.dbroot.CSIOptionsProto.displayName = 'proto.keyhole.dbroot.CSIOptionsProto';
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
proto.keyhole.dbroot.CSIOptionsProto.prototype.toObject = function(opt_includeInstance) {
  return proto.keyhole.dbroot.CSIOptionsProto.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.keyhole.dbroot.CSIOptionsProto} msg The msg instance to transform.
 * @return {!Object}
 */
proto.keyhole.dbroot.CSIOptionsProto.toObject = function(includeInstance, msg) {
  var f, obj = {
    samplingPercentage: jspb.Message.getField(msg, 1),
    experimentId: jspb.Message.getField(msg, 2)
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
 * @return {!proto.keyhole.dbroot.CSIOptionsProto}
 */
proto.keyhole.dbroot.CSIOptionsProto.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.keyhole.dbroot.CSIOptionsProto;
  return proto.keyhole.dbroot.CSIOptionsProto.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.keyhole.dbroot.CSIOptionsProto} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.keyhole.dbroot.CSIOptionsProto}
 */
proto.keyhole.dbroot.CSIOptionsProto.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setSamplingPercentage(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setExperimentId(value);
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
proto.keyhole.dbroot.CSIOptionsProto.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.keyhole.dbroot.CSIOptionsProto.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.keyhole.dbroot.CSIOptionsProto} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.keyhole.dbroot.CSIOptionsProto.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {number} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeInt32(
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
 * optional int32 sampling_percentage = 1;
 * @return {number}
 */
proto.keyhole.dbroot.CSIOptionsProto.prototype.getSamplingPercentage = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.keyhole.dbroot.CSIOptionsProto.prototype.setSamplingPercentage = function(value) {
  jspb.Message.setField(this, 1, value);
};


proto.keyhole.dbroot.CSIOptionsProto.prototype.clearSamplingPercentage = function() {
  jspb.Message.setField(this, 1, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.dbroot.CSIOptionsProto.prototype.hasSamplingPercentage = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string experiment_id = 2;
 * @return {string}
 */
proto.keyhole.dbroot.CSIOptionsProto.prototype.getExperimentId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.keyhole.dbroot.CSIOptionsProto.prototype.setExperimentId = function(value) {
  jspb.Message.setField(this, 2, value);
};


proto.keyhole.dbroot.CSIOptionsProto.prototype.clearExperimentId = function() {
  jspb.Message.setField(this, 2, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.dbroot.CSIOptionsProto.prototype.hasExperimentId = function() {
  return jspb.Message.getField(this, 2) != null;
};


