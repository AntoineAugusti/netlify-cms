import '../utils/dismiss-local-backup';

const advanceClock = () => {
  cy.tick(300);
  cy.tick(300);
};

describe('Markdown widget link', () => {
  before(() => {
    Cypress.config('defaultCommandTimeout', 4000);
    cy.task('setupBackend', { backend: 'test' });
  });

  beforeEach(() => {
    cy.clock(0, ['Date']);
    cy.clearLocalStorage();
    cy.reload();
    cy.loginAndNewPost();
    cy.clearMarkdownEditorContent();
  });

  after(() => {
    cy.task('teardownBackend', { backend: 'test' });
  });

  describe('pressing backspace', () => {
    it('can add a new valid link', () => {
      const link = 'https://www.netlifycms.org/';
      cy.window().then(win => {
        cy.stub(win, 'prompt').returns(link);
      });
      cy.focused().clickLinkButton();

      advanceClock();

      cy.confirmMarkdownEditorContent(`<p><a>${link}</a></p>`);
      cy.clickModeToggle();
      cy.confirmRawEditorContent(`<${link}>`);
    });

    it('can add a new invalid link', () => {
      const link = 'www.netlifycms.org';
      cy.window().then(win => {
        cy.stub(win, 'prompt').returns(link);
      });
      cy.focused().clickLinkButton();

      advanceClock();

      cy.confirmMarkdownEditorContent(`<p><a>${link}</a></p>`);
      cy.clickModeToggle();
      cy.confirmRawEditorContent(`[${link}](${link})`);
    });

    it('can select existing text as link', () => {
      const link = 'https://www.netlifycms.org';
      cy.window().then(win => {
        cy.stub(win, 'prompt').returns(link);
      });

      const text = 'Netlify CMS';
      cy.focused()
        .getMarkdownEditor()
        .type(text)
        .setSelection(text)
        .clickLinkButton();

      advanceClock();

      cy.confirmMarkdownEditorContent(`<p><a>${text}</a></p>`);
      cy.clickModeToggle();
      cy.confirmRawEditorContent(`[${text}](${link})`);
    });
  });
});
