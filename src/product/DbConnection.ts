export class DbConnection {
    async query(sql: string, params: string[]) {
        console.log(sql);
        return 1;
    }
}
