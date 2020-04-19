import { Config } from '../config'
import { Dependencies } from '../container'
import * as AWS from 'aws-sdk'
import fileType from 'file-type'

export interface IFileService {
    uploadFile(file: any, name: string): Promise<string>
    getFile(name: string): string
}

// TODO implement real file service with S3
export class FileService implements IFileService {
    private BUCKET_ID: string
    private BUCKET_SECRET: string
    private BUCKET_NAME: string

    constructor({ config }: Dependencies<Config>) {
        this.BUCKET_ID = config.BUCKET_ID
        this.BUCKET_SECRET = config.BUCKET_SECRET
        this.BUCKET_NAME = config.BUCKET_NAME
    }

    uploadFile(file: any, name: string): Promise<any> {
        const s3 = new AWS.S3({
            accessKeyId: this.BUCKET_ID,
            secretAccessKey: this.BUCKET_SECRET,
        })

        return new Promise((resolve: any, reject: any) => {
            try {
                ;(async () => {
                    const type = await fileType.fromBuffer(file)
                    if (type != null && type.ext == 'jpg') {
                        const params = {
                            Bucket: this.BUCKET_NAME,
                            Key: name + '.jpg',
                            Body: file,
                        }
                        s3.upload(params, function (err: any, data: any) {
                            if (err) {
                                return reject(err)
                            }

                            return resolve(data.Location)
                        })
                    } else {
                        //Log error file type
                    }
                })()
            } catch (err) {
                console.log(err)
                return reject(err)
            }
        })
    }

    getFile(name: string) {
        return 'https://' + this.BUCKET_NAME + '.s3.amazonaws.com/' + name
    }
}
