# Copy Reference for VS Code

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/aaronkazah.copy-reference)](https://marketplace.visualstudio.com/items?itemName=aaronkazah.copy-reference)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/aaronkazah.copy-reference)](https://marketplace.visualstudio.com/items?itemName=aaronkazah.copy-reference)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/aaronkazah.copy-reference)](https://marketplace.visualstudio.com/items?itemName=aaronkazah.copy-reference)

A professional VS Code extension that brings JetBrains-style "Copy Reference" functionality to Visual Studio Code. Right-click on any symbol (class, method, function, variable) to copy its full dot notation path to your clipboard.

Perfect for Django development, testing workflows, and any scenario where you need precise symbol references.

## ✨ Features

- **JetBrains-style copy reference**: Get the exact functionality you're used to from IntelliJ IDEA, PyCharm, etc.
- **Multi-language support**: Works with Python, TypeScript, JavaScript, Java, C#, C++, and more
- **Smart path detection**: Automatically detects modules, packages, namespaces, and file structures
- **Django testing ready**: Perfect for generating test paths like `python manage.py test myapp.tests.test_models.TestClass.test_method`
- **Context menu integration**: Right-click anywhere to access the feature
- **Instant clipboard copy**: Automatically copies the full path to your system clipboard

## 🚀 Installation

### Option 1: VS Code Marketplace (Recommended)

1. **Open VS Code**
2. **Go to Extensions** (Ctrl/Cmd + Shift + X)
3. **Search for "Copy Reference"** by Aaron Kazah
4. **Click Install**

[![Install from VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Install%20Extension-blue?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=aaronkazah.copy-reference)

### Option 2: Manual Installation from GitHub

1. **Download the latest VSIX file** from our [GitHub Releases](https://github.com/aaronkazah/copy-reference-vscode/releases) or directly: [copy-reference-1.0.0.vsix](https://github.com/aaronkazah/copy-reference-vscode/raw/main/releases/copy-reference-1.0.0.vsix)
2. **Open VS Code**
3. **Go to Extensions panel** (Ctrl/Cmd + Shift + X)
4. **Click the "..." menu** in the Extensions panel
5. **Select "Install from VSIX..."**
6. **Navigate to the downloaded `.vsix` file** and select it
7. **Click Install**

📋 **Need detailed installation help?** See our [Complete Installation Guide](INSTALLATION.md)

## 📖 Usage

1. **Right-click** on any symbol in your code
2. **Select "Copy Reference"** from the context menu
3. **Paste** the full dot notation path wherever you need it

### Django Testing Example

Perfect for Django testing workflows:

```python
# In myapp/tests/test_models.py
class UserModelTest(TestCase):
    def test_user_creation(self):
        # Right-click on 'test_user_creation' → Copy Reference
        pass
```

**Copied result**: `myapp.tests.test_models.UserModelTest.test_user_creation`

**Use in terminal**:
```bash
python manage.py test myapp.tests.test_models.UserModelTest.test_user_creation
```

## 📋 Example Outputs

### Python
```python
# myproject/myapp/models.py
class User:
    def get_full_name(self):
        pass
```
**Copy Reference result**: `myproject.myapp.models.User.get_full_name`

### TypeScript
```typescript
// src/services/UserService.ts
export class UserService {
    public async getUser(): Promise<User> {}
}
```
**Copy Reference result**: `UserService.getUser`

### Java
```java
// com/example/service/UserService.java
package com.example.service;
public class UserService {
    public User getUser() {}
}
```
**Copy Reference result**: `com.example.service.UserService.getUser`

## 🔧 Supported Languages

- **Python** - Full module path support
- **TypeScript/JavaScript** - ES6 modules and classes
- **Java** - Package and class hierarchy
- **C#** - Namespace and class support
- **C/C++** - Namespace and scope resolution
- **And many more...**

## 🎯 Use Cases

- **Django Testing**: Generate precise test paths for `manage.py test`
- **Code Documentation**: Reference specific methods in documentation
- **Code Reviews**: Provide exact paths when discussing code
- **Debugging**: Quickly reference problematic methods
- **API Documentation**: Generate accurate endpoint references

## 🤝 Contributing

Found a bug or want to contribute? 

1. Visit our [GitHub repository](https://github.com/aaronkazah/copy-reference-vscode)
2. Open an issue or submit a pull request
3. Help make this extension even better!

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👨‍💻 Author

**Aaron Kazah** - [@aaronkazah](https://github.com/aaronkazah)

---

⭐ **If this extension helps your workflow, please consider giving it a star on GitHub!**
