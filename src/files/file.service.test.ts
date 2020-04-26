import { FileService } from './file.service'
import fs from 'fs'

const fakeConfig = {
    config: {
        BUCKET_ID: '',
        BUCKET_SECRET: '',
        BUCKET_NAME: '',
    },
} as any
const testFile = new FileService(fakeConfig)
async function test() {
    fs.readFile('road.jpg', async (err: any, data: any) => {
        if (err) throw err

        const file = await testFile.uploadFile(data, 'wow')
        console.log(file)
    })
}
test()
