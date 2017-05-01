const { Markup } = require('telegraf');
const { WizardScene } = require('telegraf-flow');

const artistWizard = new WizardScene('artistWizard',
  (ctx) => {
    ctx.reply(
      'Send me the artist name please',
      Markup.removeKeyboard().extra()
    );
    ctx.flow.wizard.next();
  },
  (ctx, next) => {
    if (ctx.message === undefined) {
      return next();
    }
    ctx.session.artist = ctx.message.text;
    ctx.flow.enter('artistMenu');
  }
);

module.exports = artistWizard;
