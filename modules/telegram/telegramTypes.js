'use strict'

var tgTypes = {};

tgTypes.InlineKeyboardMarkup = function (rowWidth) {
    this['inline_keyboard'] = [[]];
    var rowWidth = (rowWidth > 8 ? 8 : rowWidth) || 8;  //Currently maximum supported in one row
    //Closure to make this property private
    this._rowWidth = function () {
        return rowWidth;
    };
};

tgTypes.InlineKeyboardMarkup.prototype.add = function (text, field, fieldValue) {
    this['inline_keyboard'][this._lastRow()].push(
        {
            'text': text,
            [field]: fieldValue
        }
    );

    if (this._isRowFull()) {
        this.newRow();
    };
    return this;
};

tgTypes.InlineKeyboardMarkup.prototype.newRow = function () {
    this['inline_keyboard'].push([]);
    return this;
};

tgTypes.InlineKeyboardMarkup.prototype._isRowFull = function () {
    if (this['inline_keyboard'][this._lastRow()] === this._rowWidth()-1) {
        return true;
    };
};

tgTypes.InlineKeyboardMarkup.prototype._lastRow = function () {
    return this['inline_keyboard'].length-1;
};

module.exports = tgTypes;
