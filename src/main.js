const flatten = imm => {
    const res = new imm.constructor();
    res._roots = [];
    res._depth = 0;
    if (imm._roots.length === 0) res._properties = imm._properties;
    else {
        imm._roots.reverse();
        const roots = imm._roots.concat();
        imm._roots.reverse();
        res._properties = Object.assign(
            roots.map(root => flatten(root)._properties)
                .reduce((acc, imm) => Object.assign(acc, imm), {})
            , imm._properties);
    }
    return res;
};
export default class Immutable {
    constructor(obj) {
        this._roots = [];
        this._properties = obj;
        this._depth = 0;
    }
    set(key, value) {
        const res = new this.constructor();
        res._roots = [this];
        res._properties = {[key]: value};
        res._depth = this._depth + 1;
        if (res._depth >= 5) return flatten(res);
        return res;
    }
    get(key) {
        if (this._properties.hasOwnProperty(key)) return this._properties[key];
        if (this._roots.length === 0) return undefined;
        for (const root of this._roots) {
            const res = root.get(key);
            if (res !== undefined) return res;
        }
    }
    update(keys, f) {
        if (Array.isArray(keys)) {
            const res = this;
            return keys.reduce((bef, key) => bef.set(key, f(bef.get(key))),this);
        }
        return this.set(key, f(this.get(key)));
    }
    delete(key) {
        return this.set(key, undefined);
    }
    merge(map) {
        const res = new this.constructor();
        res._roots = [map, this];
        res._properties = {};
        res._depth = Math.max(map._depth, this._depth) + 1;
        if (res._depth >= 5) return flatten(res);
        return res;
    }
}