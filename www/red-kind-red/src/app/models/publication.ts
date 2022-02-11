import { User } from "./user";

export class Publication {
    constructor(
        public text: string,
        public name: string,
        public file: string,
        public userID: string,
        public createdAt: string
    ) { }
}