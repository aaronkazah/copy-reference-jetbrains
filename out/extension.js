"use strict";
/**
 * Copy Reference Extension for VS Code
 *
 * Provides JetBrains-style "Copy Reference" functionality that allows users to
 * right-click on any symbol and copy its full dot notation path to the clipboard.
 *
 * Supports multiple programming languages including:
 * - TypeScript/JavaScript
 * - Python
 * - Java/Kotlin/Scala
 * - C#
 * - C/C++
 *
 * @author Aaron Kazah
 * @version 1.0.3
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
/**
 * Activates the extension and registers the copy reference command
 * @param context - The extension context
 */
function activate(context) {
    const disposable = vscode.commands.registerCommand('copyReference.copyPath', async () => {
        await handleCopyReference();
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
/**
 * Handles the copy reference command execution
 */
async function handleCopyReference() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('No active editor found');
        return;
    }
    const document = editor.document;
    const position = editor.selection.active;
    // Check if this is a diff view or other special context
    const isDiffView = document.uri.scheme === 'git' || document.uri.scheme === 'file' && document.uri.path.includes('.git');
    try {
        const reference = await generateFullReference(document, position);
        if (reference) {
            await vscode.env.clipboard.writeText(reference);
            vscode.window.showInformationMessage(`Copied: ${reference}`);
        }
        else {
            // Enhanced fallback for diff views and special contexts
            const wordRange = document.getWordRangeAtPosition(position);
            if (wordRange) {
                const word = document.getText(wordRange);
                const fallbackRef = buildSimpleFallbackReference(document, word);
                if (fallbackRef) {
                    await vscode.env.clipboard.writeText(fallbackRef);
                    vscode.window.showInformationMessage(`Copied (fallback): ${fallbackRef}`);
                    return;
                }
            }
            vscode.window.showWarningMessage('Could not determine reference path for this symbol');
        }
    }
    catch (error) {
        console.error('Error generating reference:', error);
        vscode.window.showErrorMessage('Failed to copy reference. Please try again.');
    }
}
/**
 * Generates the full reference path for a symbol at the given position
 * @param document - The text document
 * @param position - The cursor position
 * @returns The full reference path or null if unable to determine
 */
async function generateFullReference(document, position) {
    // Validate that we have a word at the cursor position
    const wordRange = document.getWordRangeAtPosition(position);
    if (!wordRange) {
        return null;
    }
    const word = document.getText(wordRange);
    // Get document symbols to build the hierarchy
    const symbols = await getDocumentSymbols(document);
    if (!symbols || symbols.length === 0) {
        // Fallback: just return the word with file context
        return buildFallbackReference(document, word);
    }
    // Find the symbol hierarchy path
    const symbolPath = findSymbolHierarchy(symbols, position);
    if (symbolPath.length === 0) {
        // Try to find any symbol that matches the word at cursor
        const matchingSymbol = findSymbolByName(symbols, word);
        if (matchingSymbol) {
            return buildCompleteReference(document, [matchingSymbol]);
        }
        // Final fallback: just the word with namespace
        return buildFallbackReference(document, word);
    }
    // Build and return the complete reference
    return buildCompleteReference(document, symbolPath);
}
/**
 * Retrieves document symbols using VS Code's symbol provider
 * @param document - The text document
 * @returns Array of document symbols or null if unavailable
 */
async function getDocumentSymbols(document) {
    try {
        const symbols = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', document.uri);
        return symbols || null;
    }
    catch (error) {
        console.error('Failed to get document symbols:', error);
        return null;
    }
}
/**
 * Finds the hierarchy of symbols containing the given position
 * @param symbols - Array of document symbols
 * @param position - The target position
 * @returns Array of symbols from outermost to innermost
 */
function findSymbolHierarchy(symbols, position) {
    const hierarchy = [];
    /**
     * Recursively searches through symbol tree
     * @param symbolList - Current list of symbols to search
     * @returns true if position was found within any symbol
     */
    function searchSymbols(symbolList) {
        for (const symbol of symbolList) {
            if (symbol.range.contains(position)) {
                hierarchy.push(symbol);
                // Search children for more specific symbols
                if (symbol.children && symbol.children.length > 0) {
                    searchSymbols(symbol.children);
                }
                return true;
            }
        }
        return false;
    }
    searchSymbols(symbols);
    return hierarchy;
}
/**
 * Finds a symbol by name in the symbol tree
 * @param symbols - Array of document symbols
 * @param name - The symbol name to find
 * @returns The matching symbol or null
 */
function findSymbolByName(symbols, name) {
    for (const symbol of symbols) {
        if (symbol.name === name) {
            return symbol;
        }
        // Search children recursively
        if (symbol.children && symbol.children.length > 0) {
            const childMatch = findSymbolByName(symbol.children, name);
            if (childMatch) {
                return childMatch;
            }
        }
    }
    return null;
}
/**
 * Builds the complete reference string from document and symbol hierarchy
 * @param document - The text document
 * @param symbolPath - Array of symbols from outermost to innermost
 * @returns The complete reference string
 */
function buildCompleteReference(document, symbolPath) {
    const parts = [];
    // Add namespace/module/package prefix based on file and language
    const namespacePrefix = extractNamespacePrefix(document);
    if (namespacePrefix) {
        parts.push(namespacePrefix);
    }
    // Add all symbols in the hierarchy
    for (const symbol of symbolPath) {
        parts.push(symbol.name);
    }
    // Join with appropriate separator for the language
    const separator = getLanguageSeparator(document.languageId);
    return parts.join(separator);
}
/**
 * Extracts namespace, module, or package information from the document
 * @param document - The text document
 * @returns The namespace prefix or null if none found
 */
function extractNamespacePrefix(document) {
    const languageId = document.languageId;
    const fileContent = document.getText();
    const fileName = getFileNameWithoutExtension(document.uri);
    switch (languageId) {
        case 'python':
            return buildPythonModulePath(document, fileName);
        case 'java':
        case 'kotlin':
        case 'scala':
            return extractJvmPackage(fileContent, fileName);
        case 'csharp':
            return extractCSharpNamespace(fileContent, fileName);
        case 'typescript':
        case 'javascript':
            return extractTypeScriptModule(fileContent, fileName);
        default:
            return fileName;
    }
}
/**
 * Builds Python module path from file location
 * @param document - The text document
 * @param fileName - The base file name
 * @returns The Python module path
 */
function buildPythonModulePath(document, fileName) {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    if (workspaceFolder) {
        const relativePath = vscode.workspace.asRelativePath(document.uri);
        return relativePath
            .replace(/\//g, '.')
            .replace(/\.py$/, '');
    }
    return fileName;
}
/**
 * Extracts package information from JVM language files
 * @param fileContent - The file content
 * @param fileName - The base file name
 * @returns The package.ClassName format
 */
function extractJvmPackage(fileContent, fileName) {
    const packageMatch = fileContent.match(/package\s+([\w.]+)/);
    return packageMatch ? `${packageMatch[1]}.${fileName}` : fileName;
}
/**
 * Extracts namespace from C# files
 * @param fileContent - The file content
 * @param fileName - The base file name
 * @returns The namespace.ClassName format
 */
function extractCSharpNamespace(fileContent, fileName) {
    const namespaceMatch = fileContent.match(/namespace\s+([\w.]+)/);
    return namespaceMatch ? `${namespaceMatch[1]}.${fileName}` : fileName;
}
/**
 * Extracts module information from TypeScript/JavaScript files
 * @param fileContent - The file content
 * @param fileName - The base file name
 * @returns The module name or file name
 */
function extractTypeScriptModule(fileContent, fileName) {
    // Could be enhanced to detect module declarations, but for now use filename
    return fileName;
}
/**
 * Gets the filename without extension
 * @param uri - The file URI
 * @returns The filename without extension
 */
function getFileNameWithoutExtension(uri) {
    const fileName = uri.path.split('/').pop() || '';
    return fileName.replace(/\.[^/.]+$/, '');
}
/**
 * Returns the appropriate separator for the given language
 * @param languageId - The programming language identifier
 * @returns The separator string
 */
function getLanguageSeparator(languageId) {
    switch (languageId) {
        case 'cpp':
        case 'c':
            return '::';
        case 'python':
        case 'java':
        case 'kotlin':
        case 'scala':
        case 'csharp':
        case 'typescript':
        case 'javascript':
        default:
            return '.';
    }
}
/**
 * Builds a simple fallback reference for diff views and special contexts
 * @param document - The text document
 * @param word - The word at cursor position
 * @returns Simple reference or null
 */
function buildSimpleFallbackReference(document, word) {
    if (!word || word.trim().length === 0) {
        return null;
    }
    const languageId = document.languageId;
    // For Python, build the full module path like the main logic
    if (languageId === 'python') {
        const pythonPath = buildPythonModulePath(document, getFileNameWithoutExtension(document.uri));
        return `${pythonPath}.${word}`;
    }
    // For other languages, use basic fallback
    const fileName = getFileNameWithoutExtension(document.uri);
    const separator = getLanguageSeparator(languageId);
    return `${fileName}${separator}${word}`;
}
/**
 * Builds a fallback reference when symbols aren't available
 * @param document - The text document
 * @param word - The word at cursor position
 * @returns Fallback reference string
 */
function buildFallbackReference(document, word) {
    const fileName = getFileNameWithoutExtension(document.uri);
    const separator = getLanguageSeparator(document.languageId);
    // Try to get some context from file path for Python
    if (document.languageId === 'python') {
        const pythonPath = buildPythonModulePath(document, fileName);
        return `${pythonPath}.${word}`;
    }
    return `${fileName}${separator}${word}`;
}
/**
 * Deactivates the extension
 */
function deactivate() {
    // Extension cleanup if needed
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map