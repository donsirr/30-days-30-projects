// File System Access API type declarations
// These extend the built-in types with the async iterator methods

declare global {
    interface FileSystemDirectoryHandle {
        values(): AsyncIterableIterator<FileSystemHandle>;
        keys(): AsyncIterableIterator<string>;
        entries(): AsyncIterableIterator<[string, FileSystemHandle]>;
    }

    interface Window {
        showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
    }
}

export { };
