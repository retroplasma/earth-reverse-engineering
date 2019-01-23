/**
 * @fileoverview
 * @enhanceable
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

goog.provide('proto.keyhole.dbroot.RequirementProto');

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
proto.keyhole.dbroot.RequirementProto = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.keyhole.dbroot.RequirementProto, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.keyhole.dbroot.RequirementProto.displayName = 'proto.keyhole.dbroot.RequirementProto';
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
proto.keyhole.dbroot.RequirementProto.prototype.toObject = function(opt_includeInstance) {
  return proto.keyhole.dbroot.RequirementProto.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.keyhole.dbroot.RequirementProto} msg The msg instance to transform.
 * @return {!Object}
 */
proto.keyhole.dbroot.RequirementProto.toObject = function(includeInstance, msg) {
  var f, obj = {
    requiredVram: jspb.Message.getField(msg, 3),
    requiredClientVer: jspb.Message.getField(msg, 4),
    probability: jspb.Message.getField(msg, 5),
    requiredUserAgent: jspb.Message.getField(msg, 6),
    requiredClientCapabilities: jspb.Message.getField(msg, 7)
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
 * @return {!proto.keyhole.dbroot.RequirementProto}
 */
proto.keyhole.dbroot.RequirementProto.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.keyhole.dbroot.RequirementProto;
  return proto.keyhole.dbroot.RequirementProto.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.keyhole.dbroot.RequirementProto} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.keyhole.dbroot.RequirementProto}
 */
proto.keyhole.dbroot.RequirementProto.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setRequiredVram(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setRequiredClientVer(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setProbability(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setRequiredUserAgent(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setRequiredClientCapabilities(value);
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
proto.keyhole.dbroot.RequirementProto.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.keyhole.dbroot.RequirementProto.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.keyhole.dbroot.RequirementProto} message
 * @param {!jspb.BinaryWriter} writer
 */
proto.keyhole.dbroot.RequirementProto.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeString(
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
  f = /** @type {string} */ (jspb.Message.getField(message, 5));
  if (f != null) {
    writer.writeString(
      5,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 6));
  if (f != null) {
    writer.writeString(
      6,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 7));
  if (f != null) {
    writer.writeString(
      7,
      f
    );
  }
};


/**
 * optional string required_vram = 3;
 * @return {string}
 */
proto.keyhole.dbroot.RequirementProto.prototype.getRequiredVram = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.keyhole.dbroot.RequirementProto.prototype.setRequiredVram = function(value) {
  jspb.Message.setField(this, 3, value);
};


proto.keyhole.dbroot.RequirementProto.prototype.clearRequiredVram = function() {
  jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.dbroot.RequirementProto.prototype.hasRequiredVram = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional string required_client_ver = 4;
 * @return {string}
 */
proto.keyhole.dbroot.RequirementProto.prototype.getRequiredClientVer = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.keyhole.dbroot.RequirementProto.prototype.setRequiredClientVer = function(value) {
  jspb.Message.setField(this, 4, value);
};


proto.keyhole.dbroot.RequirementProto.prototype.clearRequiredClientVer = function() {
  jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.dbroot.RequirementProto.prototype.hasRequiredClientVer = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string probability = 5;
 * @return {string}
 */
proto.keyhole.dbroot.RequirementProto.prototype.getProbability = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/** @param {string} value */
proto.keyhole.dbroot.RequirementProto.prototype.setProbability = function(value) {
  jspb.Message.setField(this, 5, value);
};


proto.keyhole.dbroot.RequirementProto.prototype.clearProbability = function() {
  jspb.Message.setField(this, 5, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.dbroot.RequirementProto.prototype.hasProbability = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional string required_user_agent = 6;
 * @return {string}
 */
proto.keyhole.dbroot.RequirementProto.prototype.getRequiredUserAgent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/** @param {string} value */
proto.keyhole.dbroot.RequirementProto.prototype.setRequiredUserAgent = function(value) {
  jspb.Message.setField(this, 6, value);
};


proto.keyhole.dbroot.RequirementProto.prototype.clearRequiredUserAgent = function() {
  jspb.Message.setField(this, 6, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.dbroot.RequirementProto.prototype.hasRequiredUserAgent = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional string required_client_capabilities = 7;
 * @return {string}
 */
proto.keyhole.dbroot.RequirementProto.prototype.getRequiredClientCapabilities = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/** @param {string} value */
proto.keyhole.dbroot.RequirementProto.prototype.setRequiredClientCapabilities = function(value) {
  jspb.Message.setField(this, 7, value);
};


proto.keyhole.dbroot.RequirementProto.prototype.clearRequiredClientCapabilities = function() {
  jspb.Message.setField(this, 7, undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.keyhole.dbroot.RequirementProto.prototype.hasRequiredClientCapabilities = function() {
  return jspb.Message.getField(this, 7) != null;
};


