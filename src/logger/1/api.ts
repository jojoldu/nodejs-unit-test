export const api = {
    getCompanyInfo: (url: string) => {
        return url;
    }
}

export const log =  {
    error: (message: string, e?: Error) => {
        console.log(message, e);
    },
    warn: (message: string, e?: Error) => {
        console.log(message, e);
    }
}