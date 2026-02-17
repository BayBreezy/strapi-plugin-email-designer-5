# Contributing to Strapi Email Designer Plugin

First off, thank you for considering contributing to the Strapi Email Designer Plugin! It's people like you that help make this plugin such a great tool.

## Code of Conduct

This project is committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm
- Strapi v5 knowledge
- TypeScript familiarity

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Visit https://github.com/BayBreezy/strapi-plugin-email-designer-5 and click Fork
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/[your-username]/strapi-plugin-email-designer-5.git
   cd strapi-plugin-email-designer-5
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/BayBreezy/strapi-plugin-email-designer-5.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or for bug fixes:
   git checkout -b fix/your-bug-fix-name
   ```

## Development Workflow

### Project Structure

```
strapi-plugin-email-designer-5/
├── admin/                 # React admin UI
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API service client
│   │   ├── utils/        # Utility functions
│   │   └── translations/ # i18n files (en, es, fr)
│   └── tsconfig.json
├── server/               # Backend services
│   ├── src/
│   │   ├── controllers/  # HTTP handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   └── config/       # Configuration
│   └── tsconfig.json
├── package.json
└── README.md
```

### Building the Plugin

```bash
# Build both admin and server
npm run build
```

### Code Style

- Use **TypeScript** for all new code
- Add **JSDoc comments** to all functions and exported types
- Use **meaningful variable names** - no single letter variables (except in loops)
- Follow existing code patterns in the repository

### TypeScript Guidelines

- Always define return types for functions
- Use proper type definitions (avoid `any` when possible)
- Add inline documentation to complex types
- Keep types in [admin/src/types.ts](admin/src/types.ts) or local files

### Example Function Documentation

```typescript
/**
 * Sends a templated email with the provided data.
 * Supports both Strapi core templates and custom email designs.
 * 
 * @param {string} templateId - The ID of the email template to send
 * @param {object} data - Template variables to render (user, token, etc.)
 * @param {string} recipientEmail - Email address of the recipient
 * @returns {Promise<void>}
 * @throws {Error} If template not found or email provider not configured
 * 
 * @example
 * await sendTemplatedEmail('welcome', { user: { email: 'test@example.com' } }, 'test@example.com')
 */
```

## Making Changes

### 1. Frontend Changes (admin/)

- Update [admin/src/translations/en.json](admin/src/translations/en.json) with any new UI strings
- Then update [admin/src/translations/es.json](admin/src/translations/es.json) and [admin/src/translations/fr.json](admin/src/translations/fr.json)
- Components should be functional with hooks
- Add TypeScript types for all props

### 2. Backend Changes (server/)

- Keep business logic in services
- Controllers should be thin wrappers around services
- Add proper error handling and validation using Yup schemas
- Use TypeScript for type safety

### 3. Email Header/Template Features

When modifying email rendering:
- Use Mustache templating syntax `{{ variable }}`
- For unescaped content use triple braces `{{{ html }}}`
- Test with both static and dynamic template variables
- Ensure backward compatibility with existing templates

### 4. Translations (i18n)

**All UI text must be translatable:**

1. Add new keys to [admin/src/translations/en.json](admin/src/translations/en.json)
2. Add same keys to [admin/src/translations/es.json](admin/src/translations/es.json) with Spanish translations
3. Add same keys to [admin/src/translations/fr.json](admin/src/translations/fr.json) with French translations

**Translation Key Naming Convention:**
- Use dot notation: `feature.action.description`
- Examples: `testSend.modal.title`, `search.placeholder`, `versionHistory.restore`
- Group related translations together

## Committing Changes

### Commit Message Format

Use clear, descriptive commit messages:

```
type(scope): subject

body

footer
```

**Types:**
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, semicolons, etc.)
- `refactor:` Code refactoring without feature/fix
- `test:` Adding or updating tests
- `chore:` Build, dependency, or tooling changes
- `i18n:` Translation updates

**Examples:**
```
feat(test-send): add email provider status checking

fix(search): handle special characters in template names

docs: add dynamic email headers example to README

i18n: sync Spanish and French translations with English version
```

### Keeping Your Branch Updated

```bash
# Fetch upstream changes
git fetch upstream

# Rebase your branch on upstream/main
git rebase upstream/main

# If conflicts occur, resolve them, then continue
git rebase --continue
```

## Testing Your Changes

### Manual Testing Checklist

- [ ] Component renders without errors
- [ ] Form validation works correctly
- [ ] API endpoints respond correctly
- [ ] Email sending works with test-send feature
- [ ] Search functionality (if modified) finds templates correctly
- [ ] Translations appear correctly for all languages
- [ ] No console errors or warnings

### Testing Email Features

1. **Test-Send Feature:**
   - Verify email validation works
   - Test with sample data
   - Confirm email provider is checked
   - Verify error messages display properly

2. **Template Search:**
   - Search for existing templates
   - Verify case-insensitive matching
   - Test special characters
   - Confirm clear button resets search

3. **Dynamic Headers:**
   - Test static headers still work
   - Test Mustache variables in headers
   - Test URL encoding with `{{urlEncode variable}}`
   - Test List-Unsubscribe headers

## Submitting a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request on GitHub**
   - Fill out the PR template completely
   - Link any related issues using "Fixes #123"
   - Provide clear description of changes
   - Add screenshots if UI changes were made

3. **PR Guidelines**
   - One feature/fix per PR
   - Keep PRs focused and reasonably sized
   - Update CHANGELOG.md with your changes
   - Ensure all checks pass
   - Request review from maintainers

4. **Code Review Process**
   - Respond to review comments promptly
   - Make requested changes in new commits (don't force-push during review)
   - Re-request review after making changes
   - Be respectful and collaborative

## Reporting Bugs

Use the [Bug Report](/.github/ISSUE_TEMPLATE/bug_report.md) template and include:

- Steps to reproduce
- Expected vs actual behavior
- Strapi and plugin versions
- Email provider and configuration
- Error stack traces
- Environment details (OS, Node version, etc.)

## Suggesting Features

Use the [Feature Request](/.github/ISSUE_TEMPLATE/feature_request.md) template and include:

- Clear description of the feature
- Use case and why it's needed
- How it would work from a user perspective
- Alternative approaches considered

## Documentation

### README Updates

If your change affects user-facing behavior, update [README.md](README.md):
- Add before/after examples for complex features
- Document new configuration options
- Explain how to use new features

### Code Comments

- Comment complex logic
- Explain "why" not "what"
- Keep comments up-to-date with code changes
- Use JSDoc for all public functions and types

## Release Process

The maintainers handle releases using:

```bash
npm run release
```

This:
1. Formats code
2. Builds the plugin
3. Generates changelog
4. Publishes to npm
5. Pushes tags to GitHub

New features and fixes will be included in the next release.

## Questions?

- Check existing [Issues](https://github.com/[owner]/strapi-plugin-email-designer-5/issues)
- Review [README.md](README.md) for feature documentation
- Look at existing code for patterns and examples
- Ask in a new Issue with the question label

## Resources

- [Strapi v5 Documentation](https://docs.strapi.io/dev-docs/intro)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Mustache.js Manual](https://github.com/janl/mustache.js)
- [Yup Validation Documentation](https://github.com/jquense/yup)

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing! Your efforts help make email design in Strapi better for everyone! 🎉
