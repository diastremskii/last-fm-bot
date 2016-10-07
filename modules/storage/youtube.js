'use strict'

var youtube = {};
youtube.data = {};
//TODO: Replace with node-cache or Redis

/*Examples:
{
    SoundgardenBlack Hole Sun: 'https://www.youtube.com/watch?v=3mbBbFH9fAg'
}
{
    yoko takahashizankoku na tenshi: null
}
*/

exports.put = function (artist, track, url) {
    youtube.data[(artist+track).toLowerCase()] = {
        url: url
    };
};

exports.get = function (artist, track) {
    var key = (artist+track).toLowerCase();
    if (youtube.data[key]) {
        return youtube.data[key].url || 'No YouTube link found';
    };
};
