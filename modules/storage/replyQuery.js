'use strict'

var crypto = require('crypto');
var replyQuery = {};

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
    var callbackData = '&a=' + hashedArtist + '&o=' + hashedObject;
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

module.exports = replyQuery;
