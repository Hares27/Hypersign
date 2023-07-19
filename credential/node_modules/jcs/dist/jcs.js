"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// JSON Canonicalization Scheme  (JCS)  (RFC 8785)
// https://tools.ietf.org/html/rfc8785
class JCS {
    constructor(object) {
        this.buffer = '';
        this.serialize(object);
    }
    serialize(object) {
        if (object === null || typeof object !== 'object' ||
            object.toJSON != null) {
            this.buffer += JSON.stringify(object);
        }
        else if (Array.isArray(object)) {
            this.buffer += '[';
            let next = false;
            object.forEach((element) => {
                if (next) {
                    this.buffer += ',';
                }
                next = true;
                this.serialize(element);
            });
            this.buffer += ']';
        }
        else {
            this.buffer += '{';
            let next = false;
            Object.keys(object).sort().forEach((property) => {
                if (next) {
                    this.buffer += ',';
                }
                next = true;
                this.buffer += JSON.stringify(property);
                this.buffer += ':';
                this.serialize(object[property]);
            });
            this.buffer += '}';
        }
    }
    cannonicalize() {
        return this.buffer;
    }
    static cannonicalize(object) {
        return new JCS(object).cannonicalize();
    }
}
exports.default = JCS;
