// Type declarations for File System Access API
interface FileSystemFileHandle {
	getFile(): Promise<File>
}

interface FileSystemPickerOptions {
	types?: {
		description?: string
		accept: Record<string, string[]>
	}[]
	multiple?: boolean
}

interface Window {
	showOpenFilePicker(options?: FileSystemPickerOptions): Promise<FileSystemFileHandle[]>
	showSaveFilePicker(options?: FileSystemPickerOptions): Promise<FileSystemFileHandle>
}
