export class DbConnection {
    async query(sql: string, params: any[]) {
        console.log(sql);
        return 1;
    }
}
