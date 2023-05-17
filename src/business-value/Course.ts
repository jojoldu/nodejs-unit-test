import {CourseType, getCourseType} from "./CourseType";
import {LocalDateTime} from "@js-joda/core";
import {DateTimeUtil} from "../util/DateTimeUtil";

export class Course {
    type: CourseType;
    price: number;
    createdAt: LocalDateTime;

    constructor(type: CourseType, price: number, createdAt: LocalDateTime) {
        this.type = type;
        this.price = price;
        this.createdAt = createdAt;
    }

    static create(type: string, price:number, createdAt: Date) {
        return new Course(getCourseType(type), price, DateTimeUtil.toLocalDateTime(createdAt));
    }

}

export class CourseLegacy {
    type: string;
    price: number;
    createdAt: Date;

    constructor(type: string, price: number, createdAt: Date) {
        this.type = type;
        this.price = price;
        this.createdAt = createdAt;
    }
}
