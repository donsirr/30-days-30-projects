/**
 * ContextBundler - File Utilities
 * Core file processing logic for bundling codebases into LLM-ready markdown
 */

// Files and directories to ignore - Enhanced regex-based filtering
export const IGNORE_PATTERNS = {
  // Directories to skip (exact match or regex)
  directories: [
    // Version Control
    '.git',
    '.svn',
    '.hg',
    '.bzr',

    // Dependencies
    'node_modules',
    'venv',
    '.venv',
    'env',
    '__pycache__',
    'target',
    'vendor',
    'bower_components',
    'jspm_packages',
    '.pnpm',

    // Build outputs
    'dist',
    'build',
    'out',
    '.next',
    '.nuxt',
    '.output',
    '.vercel',
    '.netlify',

    // IDE/Editor
    '.vscode',
    '.idea',
    '.vs',
    '.fleet',

    // Cache/Temp
    '.cache',
    '.parcel-cache',
    '.turbo',
    'coverage',
    '.nyc_output',
    '.pytest_cache',
    '.mypy_cache',
    '.ruff_cache',
    '__snapshots__',
    '.temp',
    '.tmp',
  ],

  // Regex patterns for directory names
  directoryPatterns: [
    /^\..*cache$/i,      // Any .xxxcache directory
    /^__.*__$/,          // Python dunder directories
  ],

  // Files to skip (exact match)
  files: [
    // Lockfiles
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    'composer.lock',
    'Gemfile.lock',
    'Cargo.lock',
    'poetry.lock',
    'bun.lockb',
    'shrinkwrap.yaml',

    // OS files
    '.DS_Store',
    '.DS_Store?',
    'Thumbs.db',
    'desktop.ini',

    // IDE/Editor
    '.editorconfig',
    '.prettierignore',
    '.eslintcache',

    // Misc
    '.npmrc',
    '.yarnrc',
    '.nvmrc',
  ],

  // Regex patterns for file names
  filePatterns: [
    /^\.git.*$/,         // .gitignore, .gitattributes, etc (but keep for review)
    /.*\.min\.(js|css)$/i,  // Minified files
    /.*\.map$/i,         // Source maps
    /.*\.chunk\.(js|css)$/i, // Chunk files
    /.*-lock\.(json|yaml)$/i, // Lock files pattern
    /^README\.md$/i,     // README files
    /^CHANGELOG\.md$/i,  // Changelog files
    /^LICENSE(\.md|\.txt)?$/i, // License files
  ],

  // Binary/non-text extensions to skip (always)
  binaryExtensions: [
    // Images
    'png', 'jpg', 'jpeg', 'gif', 'bmp', 'ico', 'webp', 'svg', 'avif', 'heic', 'tiff', 'raw',

    // Video
    'mp4', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'webm', 'm4v',

    // Audio
    'mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma',

    // Documents
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp',

    // Archives
    'zip', 'tar', 'gz', 'rar', '7z', 'bz2', 'xz', 'tgz',

    // Executables
    'exe', 'dll', 'so', 'dylib', 'bin', 'msi', 'dmg', 'app',

    // Fonts
    'woff', 'woff2', 'ttf', 'eot', 'otf',

    // Compiled
    'pyc', 'pyo', 'class', 'o', 'obj', 'a', 'lib', 'pdb',

    // Database
    'db', 'sqlite', 'sqlite3', 'mdb',

    // Other binary
    'iso', 'img', 'vmdk', 'vdi',
  ],
};

// Language mapping for markdown code blocks
export const LANGUAGE_MAP: Record<string, string> = {
  // JavaScript/TypeScript
  'js': 'javascript',
  'jsx': 'jsx',
  'ts': 'typescript',
  'tsx': 'tsx',
  'mjs': 'javascript',
  'cjs': 'javascript',

  // Web
  'html': 'html',
  'htm': 'html',
  'css': 'css',
  'scss': 'scss',
  'sass': 'sass',
  'less': 'less',
  'vue': 'vue',
  'svelte': 'svelte',

  // Python
  'py': 'python',
  'pyx': 'python',
  'pyi': 'python',

  // Systems
  'rs': 'rust',
  'go': 'go',
  'c': 'c',
  'h': 'c',
  'cpp': 'cpp',
  'hpp': 'cpp',
  'cc': 'cpp',
  'cxx': 'cpp',
  'java': 'java',
  'kt': 'kotlin',
  'swift': 'swift',

  // Data/Config
  'json': 'json',
  'yaml': 'yaml',
  'yml': 'yaml',
  'toml': 'toml',
  'xml': 'xml',
  'ini': 'ini',
  'env': 'bash',

  // Shell
  'sh': 'bash',
  'bash': 'bash',
  'zsh': 'bash',
  'fish': 'fish',
  'ps1': 'powershell',
  'bat': 'batch',
  'cmd': 'batch',

  // Others
  'md': 'markdown',
  'mdx': 'mdx',
  'sql': 'sql',
  'graphql': 'graphql',
  'gql': 'graphql',
  'rb': 'ruby',
  'php': 'php',
  'lua': 'lua',
  'r': 'r',
  'dockerfile': 'dockerfile',
  'makefile': 'makefile',
};

export interface FileEntry {
  path: string;
  name: string;
  content: string;
  size: number;
}

export interface DirectoryEntry {
  path: string;
  name: string;
  children: (FileEntry | DirectoryEntry)[];
  isDirectory: true;
}

export interface ProcessingResult {
  files: FileEntry[];
  tree: string;
  totalSize: number;
  fileCount: number;
  skippedCount: number;
}

/**
 * Determines the language for markdown code block based on file extension
 */
export function getLanguageFromExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  // Handle special filenames
  const lowerName = filename.toLowerCase();
  if (lowerName === 'dockerfile') return 'dockerfile';
  if (lowerName === 'makefile') return 'makefile';
  if (lowerName.startsWith('.env')) return 'bash';

  return LANGUAGE_MAP[ext] || 'text';
}

/**
 * Check if file should be ignored
 */
export function shouldIgnoreFile(name: string): boolean {
  // Exact match check
  if (IGNORE_PATTERNS.files.includes(name)) return true;

  // Check binary extensions
  const ext = name.split('.').pop()?.toLowerCase() || '';
  if (IGNORE_PATTERNS.binaryExtensions.includes(ext)) return true;

  // Check regex patterns
  for (const pattern of IGNORE_PATTERNS.filePatterns) {
    if (pattern.test(name)) return true;
  }

  // Ignore hidden files (except .env variants and important config files)
  if (name.startsWith('.') && !name.startsWith('.env')) {
    // Keep some config files that are useful for context
    const keepFiles = ['.eslintrc', '.prettierrc', '.babelrc', '.npmignore'];
    if (!keepFiles.some(f => name.startsWith(f))) {
      return true;
    }
  }

  return false;
}

/**
 * Check if directory should be ignored
 */
export function shouldIgnoreDirectory(name: string): boolean {
  // Exact match check
  if (IGNORE_PATTERNS.directories.includes(name)) return true;

  // Check regex patterns
  for (const pattern of IGNORE_PATTERNS.directoryPatterns) {
    if (pattern.test(name)) return true;
  }

  // Ignore hidden directories (but be more lenient than files)
  if (name.startsWith('.') && !IGNORE_PATTERNS.directories.includes(name)) {
    return true;
  }

  return false;
}

/**
 * Strip comments from source code (basic implementation)
 */
export function stripComments(content: string, language: string): string {
  let result = content;

  // Single-line comments for C-style languages
  if (['javascript', 'typescript', 'jsx', 'tsx', 'java', 'c', 'cpp', 'rust', 'go', 'swift', 'kotlin'].includes(language)) {
    result = result.replace(/\/\/.*$/gm, '');
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  // Python/Ruby/Shell comments
  if (['python', 'ruby', 'bash', 'yaml'].includes(language)) {
    result = result.replace(/#.*$/gm, '');
    // Python docstrings
    if (language === 'python') {
      result = result.replace(/"""[\s\S]*?"""/g, '');
      result = result.replace(/'''[\s\S]*?'''/g, '');
    }
  }

  // HTML/XML comments
  if (['html', 'xml', 'vue', 'svelte'].includes(language)) {
    result = result.replace(/<!--[\s\S]*?-->/g, '');
  }

  // CSS comments
  if (['css', 'scss', 'less'].includes(language)) {
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  // Clean up extra blank lines
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n');

  return result.trim();
}

/**
 * Generate ASCII tree representation
 */
export function generateTree(
  entries: { path: string; isFile: boolean }[],
  rootName: string = 'project'
): string {
  if (entries.length === 0) return `${rootName}/\n`;

  // Build tree structure
  interface TreeNode {
    name: string;
    children: Map<string, TreeNode>;
    isFile: boolean;
  }

  const root: TreeNode = { name: rootName, children: new Map(), isFile: false };

  for (const entry of entries) {
    const parts = entry.path.split('/').filter(Boolean);
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (!current.children.has(part)) {
        current.children.set(part, {
          name: part,
          children: new Map(),
          isFile: isLast && entry.isFile,
        });
      }
      current = current.children.get(part)!;
    }
  }

  // Render tree
  const lines: string[] = [`${rootName}/`];

  function renderNode(node: TreeNode, prefix: string, isLast: boolean): void {
    const sortedChildren = Array.from(node.children.values()).sort((a, b) => {
      // Directories first, then alphabetical
      if (!a.isFile && b.isFile) return -1;
      if (a.isFile && !b.isFile) return 1;
      return a.name.localeCompare(b.name);
    });

    for (let i = 0; i < sortedChildren.length; i++) {
      const child = sortedChildren[i];
      const isChildLast = i === sortedChildren.length - 1;
      const connector = isChildLast ? '└── ' : '├── ';
      const newPrefix = prefix + (isChildLast ? '    ' : '│   ');

      lines.push(`${prefix}${connector}${child.name}${child.isFile ? '' : '/'}`);

      if (!child.isFile) {
        renderNode(child, newPrefix, isChildLast);
      }
    }
  }

  renderNode(root, '', true);

  return lines.join('\n');
}

/**
 * Read file content as text
 */
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/**
 * Process a directory using File System Access API
 */
export async function processDirectory(
  dirHandle: FileSystemDirectoryHandle,
  basePath: string = '',
  onProgress?: (current: number, total: number) => void
): Promise<ProcessingResult> {
  const files: FileEntry[] = [];
  const entries: { path: string; isFile: boolean }[] = [];
  let skippedCount = 0;
  let processedCount = 0;

  // First pass: collect all entries
  const allEntries: { handle: FileSystemHandle; path: string }[] = [];

  async function collectEntries(
    handle: FileSystemDirectoryHandle,
    currentPath: string
  ): Promise<void> {
    for await (const entry of handle.values()) {
      const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;

      if (entry.kind === 'directory') {
        if (shouldIgnoreDirectory(entry.name)) {
          skippedCount++;
          continue;
        }
        entries.push({ path: entryPath, isFile: false });
        await collectEntries(entry as FileSystemDirectoryHandle, entryPath);
      } else {
        if (shouldIgnoreFile(entry.name)) {
          skippedCount++;
          continue;
        }
        allEntries.push({ handle: entry, path: entryPath });
        entries.push({ path: entryPath, isFile: true });
      }
    }
  }

  await collectEntries(dirHandle, basePath);

  // Second pass: read files with progress updates
  const totalFiles = allEntries.length;

  for (const { handle, path } of allEntries) {
    try {
      const fileHandle = handle as FileSystemFileHandle;
      const file = await fileHandle.getFile();

      // Skip large files (> 1MB)
      if (file.size > 1024 * 1024) {
        skippedCount++;
        processedCount++;
        onProgress?.(processedCount, totalFiles);
        continue;
      }

      const content = await readFileAsText(file);

      files.push({
        path,
        name: handle.name,
        content,
        size: file.size,
      });
    } catch (error) {
      // Skip files that can't be read as text
      skippedCount++;
    }

    processedCount++;
    onProgress?.(processedCount, totalFiles);

    // Yield to main thread every 10 files
    if (processedCount % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  const tree = generateTree(entries, dirHandle.name);
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return {
    files,
    tree,
    totalSize,
    fileCount: files.length,
    skippedCount,
  };
}

/**
 * Process files from drag and drop
 */
export async function processDroppedItems(
  items: DataTransferItemList,
  onProgress?: (current: number, total: number) => void
): Promise<ProcessingResult> {
  const files: FileEntry[] = [];
  const entries: { path: string; isFile: boolean }[] = [];
  let skippedCount = 0;

  // Collect all file entries first
  const fileEntries: { entry: FileSystemEntry; path: string }[] = [];

  async function traverseEntry(
    entry: FileSystemEntry,
    path: string = ''
  ): Promise<void> {
    const currentPath = path ? `${path}/${entry.name}` : entry.name;

    if (entry.isDirectory) {
      if (shouldIgnoreDirectory(entry.name)) {
        skippedCount++;
        return;
      }

      entries.push({ path: currentPath, isFile: false });

      const dirEntry = entry as FileSystemDirectoryEntry;
      const reader = dirEntry.createReader();

      const readEntries = (): Promise<FileSystemEntry[]> => {
        return new Promise((resolve, reject) => {
          reader.readEntries(resolve, reject);
        });
      };

      let allEntries: FileSystemEntry[] = [];
      let batch: FileSystemEntry[];

      do {
        batch = await readEntries();
        allEntries = allEntries.concat(batch);
      } while (batch.length > 0);

      for (const childEntry of allEntries) {
        await traverseEntry(childEntry, currentPath);
      }
    } else {
      if (shouldIgnoreFile(entry.name)) {
        skippedCount++;
        return;
      }

      fileEntries.push({ entry, path: currentPath });
      entries.push({ path: currentPath, isFile: true });
    }
  }

  // Start traversal
  const webkitEntries: FileSystemEntry[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const entry = item.webkitGetAsEntry?.();
    if (entry) {
      webkitEntries.push(entry);
    }
  }

  for (const entry of webkitEntries) {
    await traverseEntry(entry);
  }

  // Read file contents
  const totalFiles = fileEntries.length;
  let processedCount = 0;

  for (const { entry, path } of fileEntries) {
    try {
      const fileEntry = entry as FileSystemFileEntry;
      const file = await new Promise<File>((resolve, reject) => {
        fileEntry.file(resolve, reject);
      });

      if (file.size > 1024 * 1024) {
        skippedCount++;
        processedCount++;
        onProgress?.(processedCount, totalFiles);
        continue;
      }

      const content = await readFileAsText(file);

      files.push({
        path,
        name: entry.name,
        content,
        size: file.size,
      });
    } catch (error) {
      skippedCount++;
    }

    processedCount++;
    onProgress?.(processedCount, totalFiles);

    if (processedCount % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  const rootName = webkitEntries.length === 1 ? webkitEntries[0].name : 'project';
  const tree = generateTree(entries, rootName);
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return {
    files,
    tree,
    totalSize,
    fileCount: files.length,
    skippedCount,
  };
}

/**
 * Generate the final markdown bundle
 */
export function generateBundle(
  result: ProcessingResult,
  options: {
    stripComments?: boolean;
    redactSecrets?: boolean;
    redactFunction?: (content: string) => { redactedContent: string; redactionCount: number };
  } = {}
): { bundle: string; redactionCount: number } {
  const { stripComments = false, redactSecrets = false, redactFunction } = options;
  const lines: string[] = [];
  let totalRedactionCount = 0;

  // Project Tree comes first (after AI persona header which is added separately)
  lines.push('# Project Bundle');
  lines.push('');

  // Project Structure
  lines.push('## Project Structure');
  lines.push('');
  lines.push('```');
  lines.push(result.tree);
  lines.push('```');
  lines.push('');

  // Metadata Section
  lines.push('## Metadata');
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Files Processed | ${result.fileCount} |`);
  lines.push(`| Total Size | ${formatBytes(result.totalSize)} |`);
  lines.push(`| Files Skipped | ${result.skippedCount} |`);
  if (stripComments) {
    lines.push(`| Comments | Stripped |`);
  }
  if (redactSecrets) {
    lines.push(`| Secrets | Redacted |`);
  }
  lines.push('');

  // File Contents
  lines.push('## File Contents');
  lines.push('');

  // Sort files by path
  const sortedFiles = [...result.files].sort((a, b) =>
    a.path.localeCompare(b.path)
  );

  for (const file of sortedFiles) {
    const language = getLanguageFromExtension(file.name);
    let content = file.content;

    // Apply comment stripping
    if (stripComments) {
      content = stripCommentsFromCode(content, language);
    }

    // Apply secret redaction
    if (redactSecrets && redactFunction) {
      const { redactedContent, redactionCount } = redactFunction(content);
      content = redactedContent;
      totalRedactionCount += redactionCount;
    }

    lines.push(`### File: ${file.path}`);
    lines.push('');
    lines.push(`\`\`\`${language}`);
    lines.push(content);
    lines.push('```');
    lines.push('');
  }

  return {
    bundle: lines.join('\n'),
    redactionCount: totalRedactionCount,
  };
}

// Renamed to avoid conflict
function stripCommentsFromCode(content: string, language: string): string {
  return stripComments(content, language);
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Estimate token count (rough approximation: ~4 chars per token)
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
