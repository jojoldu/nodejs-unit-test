export class FilePath {
    private readonly _path1: string;
    private readonly _path2: string;
    private readonly _path3: string;
    private readonly _path4: string;

    constructor(path1: string, path2: string, path3: string, path4: string) {
        this._path1 = path1;
        this._path2 = path2;
        this._path3 = path3;
        this._path4 = path4;
    }

    get fullPath(): string {
        return `C:\\Output Folder\\${[this._path1, this._path2, this._path3, this._path4].join('\\')}`;
    }

    get path1(): string {
        return this._path1;
    }

    get path2(): string {
        return this._path2;
    }

    get path3(): string {
        return this._path3;
    }

    get path4(): string {
        return this._path4;
    }
}
