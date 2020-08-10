/*eslint-disable*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.DrawEvent = (function() {

    /**
     * Properties of a DrawEvent.
     * @exports IDrawEvent
     * @interface IDrawEvent
     * @property {number|null} [x1] DrawEvent x1
     * @property {number|null} [y1] DrawEvent y1
     * @property {number|null} [x2] DrawEvent x2
     * @property {number|null} [y2] DrawEvent y2
     * @property {number|null} [thickness] DrawEvent thickness
     * @property {number|null} [colour] DrawEvent colour
     */

    /**
     * Constructs a new DrawEvent.
     * @exports DrawEvent
     * @classdesc Represents a DrawEvent.
     * @implements IDrawEvent
     * @constructor
     * @param {IDrawEvent=} [properties] Properties to set
     */
    function DrawEvent(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * DrawEvent x1.
     * @member {number} x1
     * @memberof DrawEvent
     * @instance
     */
    DrawEvent.prototype.x1 = 0;

    /**
     * DrawEvent y1.
     * @member {number} y1
     * @memberof DrawEvent
     * @instance
     */
    DrawEvent.prototype.y1 = 0;

    /**
     * DrawEvent x2.
     * @member {number} x2
     * @memberof DrawEvent
     * @instance
     */
    DrawEvent.prototype.x2 = 0;

    /**
     * DrawEvent y2.
     * @member {number} y2
     * @memberof DrawEvent
     * @instance
     */
    DrawEvent.prototype.y2 = 0;

    /**
     * DrawEvent thickness.
     * @member {number} thickness
     * @memberof DrawEvent
     * @instance
     */
    DrawEvent.prototype.thickness = 0;

    /**
     * DrawEvent colour.
     * @member {number} colour
     * @memberof DrawEvent
     * @instance
     */
    DrawEvent.prototype.colour = 0;

    /**
     * Creates a new DrawEvent instance using the specified properties.
     * @function create
     * @memberof DrawEvent
     * @static
     * @param {IDrawEvent=} [properties] Properties to set
     * @returns {DrawEvent} DrawEvent instance
     */
    DrawEvent.create = function create(properties) {
        return new DrawEvent(properties);
    };

    /**
     * Encodes the specified DrawEvent message. Does not implicitly {@link DrawEvent.verify|verify} messages.
     * @function encode
     * @memberof DrawEvent
     * @static
     * @param {IDrawEvent} message DrawEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DrawEvent.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.x1 != null && Object.hasOwnProperty.call(message, "x1"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.x1);
        if (message.y1 != null && Object.hasOwnProperty.call(message, "y1"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.y1);
        if (message.x2 != null && Object.hasOwnProperty.call(message, "x2"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.x2);
        if (message.y2 != null && Object.hasOwnProperty.call(message, "y2"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.y2);
        if (message.thickness != null && Object.hasOwnProperty.call(message, "thickness"))
            writer.uint32(/* id 5, wireType 0 =*/40).int32(message.thickness);
        if (message.colour != null && Object.hasOwnProperty.call(message, "colour"))
            writer.uint32(/* id 6, wireType 0 =*/48).int32(message.colour);
        return writer;
    };

    /**
     * Encodes the specified DrawEvent message, length delimited. Does not implicitly {@link DrawEvent.verify|verify} messages.
     * @function encodeDelimited
     * @memberof DrawEvent
     * @static
     * @param {IDrawEvent} message DrawEvent message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DrawEvent.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DrawEvent message from the specified reader or buffer.
     * @function decode
     * @memberof DrawEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {DrawEvent} DrawEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DrawEvent.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.DrawEvent();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.x1 = reader.int32();
                break;
            case 2:
                message.y1 = reader.int32();
                break;
            case 3:
                message.x2 = reader.int32();
                break;
            case 4:
                message.y2 = reader.int32();
                break;
            case 5:
                message.thickness = reader.int32();
                break;
            case 6:
                message.colour = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a DrawEvent message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof DrawEvent
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {DrawEvent} DrawEvent
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DrawEvent.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DrawEvent message.
     * @function verify
     * @memberof DrawEvent
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DrawEvent.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.x1 != null && message.hasOwnProperty("x1"))
            if (!$util.isInteger(message.x1))
                return "x1: integer expected";
        if (message.y1 != null && message.hasOwnProperty("y1"))
            if (!$util.isInteger(message.y1))
                return "y1: integer expected";
        if (message.x2 != null && message.hasOwnProperty("x2"))
            if (!$util.isInteger(message.x2))
                return "x2: integer expected";
        if (message.y2 != null && message.hasOwnProperty("y2"))
            if (!$util.isInteger(message.y2))
                return "y2: integer expected";
        if (message.thickness != null && message.hasOwnProperty("thickness"))
            if (!$util.isInteger(message.thickness))
                return "thickness: integer expected";
        if (message.colour != null && message.hasOwnProperty("colour"))
            if (!$util.isInteger(message.colour))
                return "colour: integer expected";
        return null;
    };

    /**
     * Creates a DrawEvent message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DrawEvent
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {DrawEvent} DrawEvent
     */
    DrawEvent.fromObject = function fromObject(object) {
        if (object instanceof $root.DrawEvent)
            return object;
        var message = new $root.DrawEvent();
        if (object.x1 != null)
            message.x1 = object.x1 | 0;
        if (object.y1 != null)
            message.y1 = object.y1 | 0;
        if (object.x2 != null)
            message.x2 = object.x2 | 0;
        if (object.y2 != null)
            message.y2 = object.y2 | 0;
        if (object.thickness != null)
            message.thickness = object.thickness | 0;
        if (object.colour != null)
            message.colour = object.colour | 0;
        return message;
    };

    /**
     * Creates a plain object from a DrawEvent message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DrawEvent
     * @static
     * @param {DrawEvent} message DrawEvent
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DrawEvent.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.x1 = 0;
            object.y1 = 0;
            object.x2 = 0;
            object.y2 = 0;
            object.thickness = 0;
            object.colour = 0;
        }
        if (message.x1 != null && message.hasOwnProperty("x1"))
            object.x1 = message.x1;
        if (message.y1 != null && message.hasOwnProperty("y1"))
            object.y1 = message.y1;
        if (message.x2 != null && message.hasOwnProperty("x2"))
            object.x2 = message.x2;
        if (message.y2 != null && message.hasOwnProperty("y2"))
            object.y2 = message.y2;
        if (message.thickness != null && message.hasOwnProperty("thickness"))
            object.thickness = message.thickness;
        if (message.colour != null && message.hasOwnProperty("colour"))
            object.colour = message.colour;
        return object;
    };

    /**
     * Converts this DrawEvent to JSON.
     * @function toJSON
     * @memberof DrawEvent
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DrawEvent.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return DrawEvent;
})();

module.exports = $root;
