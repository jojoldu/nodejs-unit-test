import { Connection } from 'typeorm/connection/Connection';

export async function unloggedTable(connection: Connection) {
  const entities = connection.entityMetadatas;
  await Promise.all(entities.map(entity => {
    connection.createEntityManager().query(`ALTER TABLE ${entity.tableName} SET UNLOGGED;`);
  }));

}
