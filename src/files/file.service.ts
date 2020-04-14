export interface IFileService {
    uploadFile(file: any, name: string): Promise<string>
    getFile(name: string): Promise<string>
}

// TODO implement real file service with S3
export class FileService implements IFileService {
    async uploadFile(file: any, name: string) {
        return 'random url'
    }

    async getFile(name: string) {
        return 'random url'
    }
}
