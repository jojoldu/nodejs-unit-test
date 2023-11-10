import { Product } from "./Product";
import {ProductCreateDto} from "./ProductCreateDto";

export class ProductService {
    async create_1 (createDtos: ProductCreateDto[]) {
        const promiseList = [];
        const results = [];
        for(const dto of createDtos) {
            const entity = dto.toEntity(generateId());
            const queryParams = [];

            const query = `INSERT INTO ${ CLASS_TABLE_NAME }` +
                `(${ Object.keys(entity).map(k => convertCamelToSnakeName(k)) }) ` +
                `VALUES ( ${convertUuidToBinParam()}, ${convertUuidToBinParam()}, ${convertUuidToBinParam()}, ?, ?, ?, ?, ?, ?, NOW(), NOW() )`;

            queryParams.push(
                entity.id,
                entity.categoryId,
                entity.teacherId,
                entity.nameHash,
                entity.name,
                entity.price,
                entity.state,
                entity.isDeleted,
                entity.description
            );
            promiseList.push(this.dbConnection.query(query, queryParams))
            results.push(ClassDto.fromEntity(entity));
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
