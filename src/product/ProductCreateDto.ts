import {Product} from "./Product";

export class ProductCreateDto {
    private readonly name: string;
    private readonly price: number;
    private readonly description: string;

    toEntity(id: string) {
        return Product.newInstance(id,this.name, this.price, this.description)
    }
}
