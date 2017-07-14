const { Markup } = require('telegraf');
const { WizardScene } = require('telegraf-flow');

const backButton = [
  '⬅️ Back'
];

const backKeyboard = Markup
  .keyboard(backButton)
  .resize()
  .extra();

const artistWizard = new WizardScene('artistWizard',
  (ctx) => {
    ctx.reply('Send me the artist name please', backKeyboard);
    ctx.flow.wizard.next();
  },
  (ctx, next) => {
    if (ctx.message === undefined) {
      return next();
    }
    if (ctx.message.text === '⬅️ Back') {
      return ctx.flow.enter('startMenu');
    }

    ctx.session.artist = ctx.message.text;
    ctx.flow.enter('artistMenu');
  }
);

module.exports = artistWizard;
