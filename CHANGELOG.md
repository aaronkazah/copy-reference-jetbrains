# Change Log

All notable changes to the "Copy Reference" extension will be documented in this file.

## [1.0.3] - 2025-06-05

### Fixed
- Improved diff view support with proper full module path generation
- Enhanced fallback logic for special VS Code contexts (git diff, merge views)
- Fixed issue where diff mode only copied partial paths (e.g., test_file instead of apps.module.tests.test_file)

## [1.0.2] - 2025-06-05

### Improved
- Enhanced symbol detection and fallback mechanisms
- Better handling of special VS Code contexts
- Improved error handling and user feedback

## [1.0.0] - 2025-06-03

### Added
- Initial release of Copy Reference extension
- JetBrains-style copy reference functionality
- Multi-language support (Python, TypeScript, JavaScript, Java, C#, C++, etc.)
- Smart path detection for modules, packages, and namespaces
- Context menu integration
- Django testing workflow support
- Automatic clipboard copying
- Professional documentation and examples

### Features
- Right-click context menu with "Copy Reference" option
- Full dot notation path generation
- Language-specific formatting and separators
- Nested symbol hierarchy support
- Works with VS Code's built-in symbol providers

### Supported Languages
- Python (with module path detection)
- TypeScript/JavaScript (ES6 modules)
- Java (package hierarchy)
- C# (namespace support)
- C/C++ (scope resolution)
- And many more languages supported by VS Code
