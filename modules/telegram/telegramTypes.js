'use strict'

var tgTypes = {};

tgTypes.InlineKeyboardMarkup = function (rowWidth) {
    this['inline_keyboard'] = [[]];

    //Pass rowWidth to limit numbers of buttons per row
    //Closure to make this property private
    this.rowWidth = function () {
        var rowWidth = (rowWidth > 8 ? 8 : rowWidth) || 8; //Currently maximum supported in one row
        return function () {
            return rowWidth;
        }
    };
};

tgTypes.InlineKeyboardMarkup.prototype.add = function (text, field, fieldValue) {
    var rowCount = this['inline_keyboard'].length;
    if (this['inline_keyboard'][rowCount-1].length === this.rowWidth-1) {
        this.endRow();
    }
    this['inline_keyboard'][rowCount-1].push(
        {
            'text': text,
            [field]: fieldValue
        }
    );
    return this;
};

tgTypes.InlineKeyboardMarkup.prototype.endRow = function () {
    this['inline_keyboard'].push([]);
    return this;
};

module.exports = tgTypes;
