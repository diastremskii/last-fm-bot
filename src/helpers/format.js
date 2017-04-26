class Format {
  constructor() {

  }

  static artist(artist) {
    return `Listeners: ${artist.stats.listeners}\n` +
      `Scrobbles: ${artist.stats.playcount}` +
      `${Format.similarArtists(artist.similar.artist)}` +
      `${Format.tags(artist.tags.tag)}` +
      `${artist.bio.summary ? `\nInfo: ${artist.bio.summary}` : ''}`
  }

  static album(album) {
    return `Listeners: ${album.listeners}\n` +
      `Scrobbles: ${album.playcount}` +
      `${Format.tags(album.tags.tag)}` +
      `${Format.wiki(album.wiki)}`
  }

  static track(track) {
    return `Listeners: ${track.listeners}\n` +
      `Scrobbles: ${track.playcount}` +
      `${Format.tags(track.toptags.tag)}` +
      `${Format.wiki(track.wiki)}`
  }

  static similarArtists(similarArtists) {
    if (similarArtists.length === 0) {
      return '';
    };
    return '\nSimilar artists: ' + similarArtists.map(artist => {
      return Format.addHyperlink(artist.url, artist.name);
    }).join(', ');
  }

  static tags(tags) {
    if (tags.length === 0) {
      return '';
    };
    return '\nTags: ' + tags.map(tag => {
      return Format.addHyperlink(tag.url, tag.name);
    }).join(', ');
  }

  static wiki(wiki) {
    if (!wiki || !wiki.summary) {
      return '';
    };
    return `\nInfo: ${wiki.summary}`;
  }

  static addHyperlink(url, description) {
    return `<a href="${url}">${Format.escapeHTML(description)}</a>`;
  }

  static escapeHTML(string) {
    const replacements = [
      [/\&/g, '&amp;'],
      [/\</g, '&lt;'],
      [/\>/g, '&gt;']
    ];
    return replacements.reduce((string, replacement) => {
      return string.replace(replacement[0], replacement[1])
    }, string);
  };
}

module.exports = Format;
