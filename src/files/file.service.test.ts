import { FileService } from './file.service'

const fakeConfig = {
    config: {
        BUCKET_ID: 'test',
        BUCKET_SECRET: 'test',
        BUCKET_NAME: 'test',
    },
} as any
const testFile = new FileService(fakeConfig)
console.log('UP')
const file = testFile.uploadFile('HELLO', 'test.jpeg')
