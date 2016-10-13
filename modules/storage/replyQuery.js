'use strict'

var crypto = require('crypto');
var replyQuery = {};
var qs = require('querystring');

//Maximum allowed size for button callback data - 64 bytes
//MD5 in Base64 - 24 bytes
replyQuery.artists = { /*Key - Base64 MD5 from artist name */ };

/*Example:
{
    'aJJPZFQuuxp6H4lX6NJ1ZQ==': {
        name: 'Evanescence'
        tracks: {
            'uLHdrpqv6C7Sm5c8+fCwMQ==': {
                name: 'Lies'
            },
            'BytBrpU+DIls6K1SBZnwbg==': {
                name: 'Made of Stone'
            }
        },
        albums: {
            'Pt+MomoewU3W6R3Sd64d5g==': {
                name: 'Origin'
            }
        }
    }
}
*/

replyQuery.add = function (artist, objectName, objectType) {
    var hashedArtist = crypto.createHash('md5').update(artist).digest('base64');
    var hashedObject = crypto.createHash('md5').update(objectName).digest('base64');
    // https://tools.ietf.org/html/rfc4648#page-7
    // https://en.wikipedia.org/wiki/Base64#URL_applications
    hashedArtist = replyQuery._base64urlEncode(hashedArtist);
    hashedObject = replyQuery._base64urlEncode(hashedObject);
    var callbackData = {
        a: hashedArtist,
        o: hashedObject
    };
    var artists = replyQuery.artists;

    if (!artists[hashedArtist]) {
        artists[hashedArtist] = {
            name: artist,
            [objectType]: {
                [hashedObject]: {
                    name: objectName
                }
            }
        };
    } else {
        var artistRecord = artists[hashedArtist];
        if (!artistRecord[objectType]) {
            artistRecord[objectType] = {
                [hashedObject]: {
                    name: objectName
                }
            }
        } else {
            if (!artistRecord[objectType][hashedObject]) {
                artistRecord[objectType][hashedObject] = {
                    name: objectName
                }
            }
        }
    }

    return callbackData;
};

replyQuery.get = function (hashedArtist, hashedObject, objectType) {
    var artistRecord = replyQuery.artists[hashedArtist];
    if (!artistRecord) {
        return;
    };
    var objectRecord = artistRecord[objectType][hashedObject]
    if (!objectRecord) {
        return;
    };
    return {
        artist: artistRecord.name,
        object: objectRecord.name
    };
};

replyQuery.getArtist = function (hashedArtist) {
    return replyQuery.artists[hashedArtist];
};

replyQuery._base64urlEncode = function (string) {
    var replacements = [
        [/\+/g, '-'],
        [/\//g, '_'],
        [/=/g, ''] //MD5 always have same length, so it's safe to remove padding
    ];
    return replacements.reduce(
        function(string, replacement) {
            return string.replace(replacement[0], replacement[1])
        },
        string);
};

replyQuery._base64urlDecode = function (string) {
    var replacements = [
        [/\-/g, '+'],
        [/_/g, '/']
    ];
    return replacements.reduce(
        function(string, replacement) {
            return string.replace(replacement[0], replacement[1])
        },
        string + '=='); //Place padding back
};

module.exports = replyQuery;
