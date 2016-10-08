'use strict'

var tgTypes = {};
var _rowWidth = Symbol('rowWidth');

tgTypes.InlineKeyboardMarkup = function (rowWidth) {
    this['inline_keyboard'] = [[]];
    this[_rowWidth] = (rowWidth > 8 ? 8 : rowWidth) || 8;  //Currently maximum supported in one row
};

tgTypes.InlineKeyboardMarkup.prototype.add = function (text, field, fieldValue) {
    if (this._isRowFull()) {
        this.newRow();
    };
    this['inline_keyboard'][this._lastRow()].push(
        {
            'text': text,
            [field]: fieldValue
        }
    );
    return this;
};

tgTypes.InlineKeyboardMarkup.prototype.newRow = function () {
    this['inline_keyboard'].push([]);
    return this;
};

tgTypes.InlineKeyboardMarkup.prototype._isRowFull = function () {
    if (this['inline_keyboard'][this._lastRow()].length === this[_rowWidth]) {
        return true;
    };
};

tgTypes.InlineKeyboardMarkup.prototype._lastRow = function () {
    return this['inline_keyboard'].length-1;
};

module.exports = tgTypes;
