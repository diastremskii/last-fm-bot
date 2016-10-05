'use strict'

var responses = {};
responses.artist = {};

//Cut
responses.artist.getSimilarGood = {
    "similarartists":{
        "artist":[
            {
                "name":"After Forever<>&", //test for HTML encode
                "mbid":"6b966946-5274-4e3d-aabb-7563814d805f",
                "match":"1",
                "url":"https://www.last.fm/music/After+Forever",
            },
            {
                "name":"Xandria",
                "mbid":"656a0800-3a2b-47ed-a3ff-1e2908fdd2ff",
                "match":"0.972643",
                "url":"https://www.last.fm/music/Xa.n.dria", //test for dots encode
            }
        ],
        "@attr":{
            "artist":"Epica"
        }
    }
};

//Full
responses.artist.getSimilarNoSimilar = {
    similarartists: {
        "artist": [

        ],
        "@attr": {
            "artist": "asddsa"
        }
    }
};

//Cut
responses.artist.getInfoGood = {
    "artist":{
        "name":"Hypnogaja",
        "mbid":"8877610e-66bd-4bb5-ba82-e3c255ad9903",
        "url":"https://www.last.fm/music/Hypnogaja",
        "image":[
            {
                "#text":"https://lastfm-img2.akamaized.net/i/u/34s/ee0cdc856bed4e7ba88bc8e14dc04296.png",
                "size":"small"
            },
            {
                "#text":"https://lastfm-img2.akamaized.net/i/u/64s/ee0cdc856bed4e7ba88bc8e14dc04296.png",
                "size":"medium"
            },
            {
                "#text":"https://lastfm-img2.akamaized.net/i/u/174s/ee0cdc856bed4e7ba88bc8e14dc04296.png",
                "size":"large"
            },
            {
                "#text":"https://lastfm-img2.akamaized.net/i/u/300x300/ee0cdc856bed4e7ba88bc8e14dc04296.png",
                "size":"extralarge"
            },
            {
                "#text":"https://lastfm-img2.akamaized.net/i/u/ee0cdc856bed4e7ba88bc8e14dc04296.png",
                "size":"mega"
            },
            {
                "#text":"https://lastfm-img2.akamaized.net/i/u/arQ/ee0cdc856bed4e7ba88bc8e14dc04296.png",
                "size":""
            }
        ],
        "streamable":"0",
        "ontour":"0",
        "stats":{
            "listeners":"61352",
            "playcount":"1637058"
        },
        "similar":{
            "artist":[
                {
                    "name":"Mushmellow",
                    "url":"https://www.last.fm/music/Mushmellow",
                    "image":[
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/34s/f377843aff754ba9858fc258b33a41a4.png",
                            "size":"small"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/64s/f377843aff754ba9858fc258b33a41a4.png",
                            "size":"medium"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/174s/f377843aff754ba9858fc258b33a41a4.png",
                            "size":"large"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/300x300/f377843aff754ba9858fc258b33a41a4.png",
                            "size":"extralarge"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/f377843aff754ba9858fc258b33a41a4.png",
                            "size":"mega"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/arQ/f377843aff754ba9858fc258b33a41a4.png",
                            "size":""
                        }
                    ]
                },
                {
                    "name":"Renegade Five",
                    "url":"https://www.last.fm/music/Renegade+Five",
                    "image":[
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/34s/f66982f88a6242b98cddbf180768e9a9.png",
                            "size":"small"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/64s/f66982f88a6242b98cddbf180768e9a9.png",
                            "size":"medium"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/174s/f66982f88a6242b98cddbf180768e9a9.png",
                            "size":"large"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/300x300/f66982f88a6242b98cddbf180768e9a9.png",
                            "size":"extralarge"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/f66982f88a6242b98cddbf180768e9a9.png",
                            "size":"mega"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/arQ/f66982f88a6242b98cddbf180768e9a9.png",
                            "size":""
                        }
                    ]
                },
                {
                    "name":"Memory of a Melody",
                    "url":"https://www.last.fm/music/Memory+of+a+Melody",
                    "image":[
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/34s/e161e215f3534fb08f2e3cfedfa743d8.png",
                            "size":"small"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/64s/e161e215f3534fb08f2e3cfedfa743d8.png",
                            "size":"medium"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/174s/e161e215f3534fb08f2e3cfedfa743d8.png",
                            "size":"large"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/300x300/e161e215f3534fb08f2e3cfedfa743d8.png",
                            "size":"extralarge"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/e161e215f3534fb08f2e3cfedfa743d8.png",
                            "size":"mega"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/arQ/e161e215f3534fb08f2e3cfedfa743d8.png",
                            "size":""
                        }
                    ]
                },
                {
                    "name":"Emphatic",
                    "url":"https://www.last.fm/music/Emphatic",
                    "image":[
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/34s/ec4741c4a894412aab2b80bd9728adc2.png",
                            "size":"small"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/64s/ec4741c4a894412aab2b80bd9728adc2.png",
                            "size":"medium"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/174s/ec4741c4a894412aab2b80bd9728adc2.png",
                            "size":"large"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/300x300/ec4741c4a894412aab2b80bd9728adc2.png",
                            "size":"extralarge"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/ec4741c4a894412aab2b80bd9728adc2.png",
                            "size":"mega"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/arQ/ec4741c4a894412aab2b80bd9728adc2.png",
                            "size":""
                        }
                    ]
                },
                {
                    "name":"Evans Blue",
                    "url":"https://www.last.fm/music/Evans+Blue",
                    "image":[
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/34s/30a3e942f9ab4156afba3b3732cc5ee5.png",
                            "size":"small"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/64s/30a3e942f9ab4156afba3b3732cc5ee5.png",
                            "size":"medium"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/174s/30a3e942f9ab4156afba3b3732cc5ee5.png",
                            "size":"large"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/300x300/30a3e942f9ab4156afba3b3732cc5ee5.png",
                            "size":"extralarge"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/30a3e942f9ab4156afba3b3732cc5ee5.png",
                            "size":"mega"
                        },
                        {
                            "#text":"https://lastfm-img2.akamaized.net/i/u/arQ/30a3e942f9ab4156afba3b3732cc5ee5.png",
                            "size":""
                        }
                    ]
                }
            ]
        },
        "tags":{
            "tag":[
                {
                    "name":"alternative rock",
                    "url":"https://www.last.fm/tag/alternative+rock"
                },
                {
                    "name":"hard rock",
                    "url":"https://www.last.fm/tag/hard+rock"
                },
                {
                    "name":"alternative metal",
                    "url":"https://www.last.fm/tag/alternative+metal"
                },
                {
                    "name":"alternative",
                    "url":"https://www.last.fm/tag/alternative"
                },
                {
                    "name":"rock",
                    "url":"https://www.last.fm/tag/rock"
                }
            ]
        },
        "bio":{
            "links":{
                "link":{
                    "#text":"",
                    "rel":"original",
                    "href":"https://last.fm/music/Hypnogaja/+wiki"
                }
            },
        }
    }
}

//Cut
responses.artist.getInfoNoImage = {
    "artist":{
        "name":"asddsa",
        "url":"https://www.last.fm/music/asddsa",
        "image":[
            {
                "#text":"",
                "size":"small"
            },
            {
                "#text":"",
                "size":"medium"
            },
            {
                "#text":"",
                "size":"large"
            },
            {
                "#text":"",
                "size":"extralarge"
            },
            {
                "#text":"",
                "size":"mega"
            },
            {
                "#text":"",
                "size":""
            }
        ],
    }
};

//Full
responses.artist.error = {
    "error": 6,
    "message": "The artist you supplied could not be found",
    "links": [

    ]
};

module.exports = responses;
