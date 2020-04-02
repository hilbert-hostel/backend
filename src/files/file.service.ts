export interface IFileService {
    uploadFiles(...files: any[]): Promise<string>
    getFile(name: string): Promise<string>
}

// TODO implement real file service with S3
export class FileService implements IFileService {
    async uploadFiles(...files: any[]) {
        return 'random url'
    }

    async getFile(name: string) {
        return 'random url'
    }
}
