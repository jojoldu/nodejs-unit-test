import { getConnection } from 'typeorm';

export async function unloggedTable(connection = getConnection()) {
  const entities = connection.entityMetadatas;
  await Promise.all(entities.map(entity => {
    connection.createEntityManager().query(`ALTER TABLE ${entity.tableName} SET UNLOGGED;`);
  }));
}
