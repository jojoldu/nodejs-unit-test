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
}

export async function save(product: Product) {
    console.log(product);
}

export function generateId() {
    return "uuid";
}
