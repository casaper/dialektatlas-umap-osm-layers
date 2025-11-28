import { defineConfig } from 'cspell';

export default defineConfig({
  version: 0.2,
  suggestionsTimeout: 5000,
  language: 'en-GB,de_CH',
  useGitignore: true,
  import: ['~/.config/cspell/cspell.config.yml'],
  dictionaryDefinitions: [
    {
      name: 'project-words',
      path: './project-words.txt',
      addWords: true,
      useCompounds: true,
    },
  ],
  dictionaries: ['project-words'],
  ignorePaths: ['/default_templates', '**/*.eml'],
});
