import { User } from "./user";

export class Publication {
    constructor(
        public id: any,
        public text: string,
        public name: string,
        public file: any,
        public userID: string,
        public createdAt: string
    ) { }
}