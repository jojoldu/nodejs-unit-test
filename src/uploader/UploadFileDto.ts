import { Readable } from 'stream';
import { LocalDate } from 'js-joda';

export class UploadFileDto {
    private readonly _uploaderName: string;
    private readonly _uploaderEmail: string;
    private readonly _bucket: string;
    private readonly _type: string;
    private readonly _fileName: string;
    private readonly _uniqueFileName: string;
    private readonly _data: string | Buffer | Readable | Uint8Array;
    private readonly _domain: string;
    private readonly _date: LocalDate;

    private constructor(
        uploaderName: string,
        uploaderEmail: string,
        bucket: string,
        type: string,
        fileName: string,
        uniqueFileName: string,
        data: string | Buffer | Readable | Uint8Array,
        domain = process.env.CDN_DOMAIN || '',
        date = LocalDate.now(),
    ) {
        this._uploaderName = uploaderName;
        this._uploaderEmail = uploaderEmail;
        this._bucket = bucket;
        this._type = type;
        this._fileName = fileName;
        this._uniqueFileName = uniqueFileName;
        this._data = data;
        this._domain = domain;
        this._date = date;
    }

    static by(
        uploaderName: string,
        uploaderEmail: string,
        bucket: string,
        type: string,
        fileName: string,
        data: string | Buffer | Readable | Uint8Array,
        domain?: string,
        date?: LocalDate,
    ): UploadFileDto {
        return new UploadFileDto(
            uploaderName,
            uploaderEmail,
            bucket,
            type,
            fileName,
            `${uuidv4()}.${fileName.split('.').pop() || ''}`,
            data,
            domain,
            date,
        );
    }

    get bucket(): string {
        return this._bucket;
    }

    get data(): string | Buffer | Readable | Uint8Array {
        return this._data;
    }

    get path(): string {
        return `${this._type}/${DateTimeUtil.toString(this._date)}/${
            this._uniqueFileName
        }`;
    }

    get url(): string {
        return `${this._domain}/${this.path}`;
    }

}
