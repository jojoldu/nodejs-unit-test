export class Product {
    private readonly id: string;
    private readonly name: string;
    private readonly price: number;
    private readonly status: string;
    private readonly description: string;
    private readonly createdAt: Date;
    private readonly updatedAt: Date;
    private readonly deletedAt: Date;

    constructor(id: string, name: string, price: number, status: string, description: string, createdAt: Date, updatedAt: Date, deletedAt: Date) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.status = status;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    static newInstance (id: string, name: string, price: number, description: string) {
        return new Product(
            id,
            name,
            price,
            "OPEN",
            description,
            new Date(),
            null,
            null
        )
    }
}
