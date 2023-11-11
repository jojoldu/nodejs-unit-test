export class Product {
    private readonly _id: string;
    private readonly _name: string;
    private readonly _price: number;
    private readonly _status: string;
    private readonly _description: string;
    private readonly _createdAt: Date;
    private readonly _updatedAt: Date;
    private readonly _deletedAt: Date;

    constructor(id: string, name: string, price: number, status: string, description: string, createdAt: Date, updatedAt: Date, deletedAt: Date) {
        this._id = id;
        this._name = name;
        this._price = price;
        this._status = status;
        this._description = description;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
        this._deletedAt = deletedAt;
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


    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price;
    }

    get status(): string {
        return this._status;
    }

    get description(): string {
        return this._description;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get deletedAt(): Date {
        return this._deletedAt;
    }
}
