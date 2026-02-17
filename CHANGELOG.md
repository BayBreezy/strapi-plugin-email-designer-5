# Changelog

## v0.0.9

[compare changes](https://github.com/BayBreezy/strapi-plugin-email-designer-5/compare/v0.0.8...v0.0.9)

### 🚀 Enhancements

- Add react-diff-viewer-continued dependency ([a8e7a79](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/a8e7a79))
- **version:** Implement version management controller with history retrieval, restoration and deletion ([7337d48](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/7337d48))
- **server:** Enhance `saveTemplate` to track changes and versioning ([834a9ed](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/834a9ed))
- **content-types:** Add versioning fields to email designer template ([e86a72b](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/e86a72b))
- **admin:** Add version management functions for templates to the client side ([ff44050](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/ff44050))
- **translations:** Add versioning related messages and tooltips to English translations ([e22a0ac](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/e22a0ac))
- **version-history:** Implement VersionHistoryTab component for managing template versions ([13ab8ba](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/13ab8ba))
- **version-compare-modal:** Add VersionCompareModal component for comparing template versions ([59f277c](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/59f277c))
- **designer:** Enhance email designer with version history tab and update editor modes ([824e6a1](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/824e6a1))
- **designer:** Integrate search parameters for editor mode selection ([1bcbc80](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/1bcbc80))
- **designer:** Refactor Designer component and add modular subcomponents for improved structure ([e84f102](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/e84f102))
- **version-compare-modal:** Add summaries for design, HTML, text, subject, and name changes in comparison tabs ([7174ed3](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/7174ed3))
- **version-compare-modal:** Remove unused imports for cleaner code ([1fdfc24](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/1fdfc24))
- **designer:** Implement test email functionality and add action menu ([a367a94](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/a367a94))
- **readme:** Add section for testing email templates with detailed instructions ([fd1f14a](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/fd1f14a))
- **homepage:** Add search functionality for email templates with translations ([a8d643e](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/a8d643e))
- **email:** Add support for dynamic email headers using Mustache templating. closes #49 ([#49](https://github.com/BayBreezy/strapi-plugin-email-designer-5/issues/49))
- **translations:** Add test email functionality and version history support in Spanish and French translations ([debecf3](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/debecf3))
- **commitlint:** Add commitlint configuration and CLI as dev dependencies ([b2dece6](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/b2dece6))
- **docs:** Add detailed JSDoc comments for various components and services ([8ff9be7](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/8ff9be7))
- **package:** Add GitHub username to maintainers section ([2a039ce](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/2a039ce))

### 🩹 Fixes

- Cast email configuration as unknown before EmailConfig ([55570e7](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/55570e7))
- Type annotation for exportHtml callback in Designer component ([60b117d](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/60b117d))

### 🏡 Chore

- Update dependencies and add lint-staged configuration ([3c9cf76](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/3c9cf76))
- **docs:** Inform devs about paid unlayer features. closes #54 ([#54](https://github.com/BayBreezy/strapi-plugin-email-designer-5/issues/54))
- **release:** V0.0.8 ([d918902](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/d918902))
- **server:** Implement version management service with history retrieval, restoration and deletion ([3cca2c9](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/3cca2c9))
- **server:** Add version management routes for template versions ([8ec50dd](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/8ec50dd))
- Add diff screenshot to readme ([7f5590c](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/7f5590c))

### ❤️ Contributors

- Behon Baker ([@BayBreezy](https://github.com/BayBreezy))

## v0.0.8

[compare changes](https://github.com/BayBreezy/strapi-plugin-email-designer-5/compare/v0.0.7...v0.0.8)

### 🚀 Enhancements

- Start implementing versioning ([db8475d](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/db8475d))

### 🩹 Fixes

- Cast email configuration as unknown before EmailConfig ([55570e7](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/55570e7))
- Type annotation for exportHtml callback in Designer component ([60b117d](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/60b117d))

### 📖 Documentation

- Update readme's installation script ([008e562](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/008e562))

### 📦 Build

- **deps-dev:** Bump husky from 9.1.6 to 9.1.7 ([c7854b7](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/c7854b7))
- **deps:** Bump react-intl from 6.8.7 to 7.0.1 ([08992b2](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/08992b2))

### 🏡 Chore

- **release:** V0.0.7 ([00b1017](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/00b1017))
- Bump deps ([439d766](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/439d766))
- Bump deps ([7d77ced](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/7d77ced))
- Make admin routes separate from content api routes ([159ee5e](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/159ee5e))
- Update dependencies and add lint-staged configuration ([3c9cf76](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/3c9cf76))
- **docs:** Inform devs about paid unlayer features. closes #54 ([#54](https://github.com/BayBreezy/strapi-plugin-email-designer-5/issues/54))

### ❤️ Contributors

- Behon Baker ([@BayBreezy](https://github.com/BayBreezy))

## v0.0.7

[compare changes](https://github.com/BayBreezy/strapi-plugin-email-designer-5/compare/v0.0.6...v0.0.7)

### 📦 Build

- **deps-dev:** Bump @strapi/strapi from 5.0.6 to 5.1.0 ([d03ec3a](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/d03ec3a))
- **deps-dev:** Bump @types/lodash from 4.17.10 to 4.17.12 ([652f924](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/652f924))
- **deps:** Bump react-intl from 6.8.0 to 6.8.1 ([3520322](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/3520322))
- **deps-dev:** Bump @strapi/typescript-utils from 5.0.6 to 5.1.0 ([b8a67bf](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/b8a67bf))

### 🏡 Chore

- Bump deps ([0cd966b](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/0cd966b))
- Bump deps ([f2bab97](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/f2bab97))

### ❤️ Contributors

- Behon Baker ([@BayBreezy](http://github.com/BayBreezy))

## v0.0.6

[compare changes](https://github.com/BayBreezy/strapi-plugin-email-designer-5/compare/v0.0.5...v0.0.6)

### 🚀 Enhancements

- **export single templates:** Add button to core template table that allows downloading htm / json design ([19cecc5](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/19cecc5))
- **export single templates:** Add function that downloads the file(html/json) ([d1c1725](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/d1c1725))
- **export single templates:** Add translation for download html & json tooltip ([704654e](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/704654e))
- **export single templates:** Add controller & route responsible for downloading the template ([99da92b](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/99da92b))

### 📖 Documentation

- Update readme ([7b851af](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/7b851af))

### ❤️ Contributors

- Behon Baker ([@BayBreezy](http://github.com/BayBreezy))

## v0.0.5

[compare changes](https://github.com/BayBreezy/strapi-plugin-email-designer-5/compare/v0.0.4...v0.0.5)

### 📦 Build

- **deps-dev:** Bump @strapi/typescript-utils from 5.0.1 to 5.0.3 ([a377001](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/a377001))
- **deps-dev:** Bump @types/lodash from 4.17.9 to 4.17.10 ([876868a](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/876868a))
- **deps-dev:** Bump @strapi/strapi from 5.0.1 to 5.0.3 ([a67575d](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/a67575d))
- **deps-dev:** Bump @types/react from 18.3.10 to 18.3.11 ([325efac](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/325efac))

### 🏡 Chore

- Bump deps ([b1c4456](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/b1c4456))

### ❤️ Contributors

- Behon Baker ([@BayBreezy](http://github.com/BayBreezy))

## v0.0.4

[compare changes](https://github.com/BayBreezy/strapi-plugin-email-designer-5/compare/v0.0.3...v0.0.4)

### 🩹 Fixes

- Remove `strapi-plugin` from the plugin id/name ([9f96d19](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/9f96d19))

### ❤️ Contributors

- Behon Baker ([@BayBreezy](http://github.com/BayBreezy))

## v0.0.3

[compare changes](https://github.com/BayBreezy/strapi-plugin-email-designer-5/compare/v0.0.2...v0.0.3)

### 🏡 Chore

- Fix EmailEditor import ([712caf7](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/712caf7))

### ❤️ Contributors

- Behon Baker ([@BayBreezy](http://github.com/BayBreezy))

## v0.0.2

[compare changes](https://github.com/BayBreezy/strapi-plugin-email-designer-5/compare/v0.0.1...v0.0.2)

### 📦 Build

- **changelog:** Sync changelog ([cbf4cf4](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/cbf4cf4))

### 🏡 Chore

- Export designer as default ([53aa7d4](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/53aa7d4))

### ❤️ Contributors

- Behon Baker ([@BayBreezy](http://github.com/BayBreezy))

## v0.0.1

### 🏡 Chore

- Create dependabot.yml ([00fe098](https://github.com/BayBreezy/strapi-plugin-email-designer-5/commit/00fe098))

### ❤️ Contributors

- Behon Baker ([@BayBreezy](http://github.com/BayBreezy))
