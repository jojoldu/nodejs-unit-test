import {Product} from "./Product";
import {ProductCreateDto} from "./ProductCreateDto";
import {DbConnection} from "./DbConnection";

export class ProductService {
    private readonly dbConnection: DbConnection;

    constructor(dbConnection: DbConnection) {
        this.dbConnection = dbConnection;
    }

    async create_1 (createDtos: ProductCreateDto[]) {
        const promiseList = [];
        const results: Product[] = [];
        for(const dto of createDtos) {
            const entity = dto.toEntity(generateId());
            const queryParams = [];

            const query =
            `INSERT INTO product (${ Object.keys(entity) }) `
            + 'VALUES (?, ?, ?, ?, ?, NOW(), NOW() )';

            queryParams.push(
                entity.id,
                entity.name,
                entity.price,
                entity.status,
                entity.description
            );
            promiseList.push(this.dbConnection.query(query, queryParams))
            results.push(entity);
        }

        await Promise.all(promiseList);
        return results;
    }

    async create_2 (createDtos: ProductCreateDto[]) {
        const entites = createDtos.map(dto => dto.toEntity(generateId()));

        await Promise.all(entites.map(entity =>
            this.dbConnection.query(
                `INSERT INTO product (${Object.keys(entity)}) `
                + 'VALUES (?, ?, ?, ?, ?, NOW(), NOW() )',
                [
                    entity.id,
                    entity.name,
                    entity.price,
                    entity.status,
                    entity.description
                ])));

        return entites;
    }

    async create_3 (createDtos: ProductCreateDto[]) {
        const entites = createDtos.map(dto => dto.toEntity(generateId()));

        await Promise.all(entites.map(entity =>
            this.dbConnection.query(getInsertQuery(entity), getParams(entity))));

        return entites;
    }
}

export async function save(product: Product) {
    console.log(product);
}

export function generateId() {
    return "uuid";
}

function getInsertQuery(entity: Product) {
    return `INSERT INTO product (${Object.keys(entity)}) `
        + 'VALUES (?, ?, ?, ?, ?, NOW(), NOW() )';
}

function getParams(entity: Product) {
    return [
        entity.id,
        entity.name,
        entity.price,
        entity.status,
        entity.description
    ];
}
