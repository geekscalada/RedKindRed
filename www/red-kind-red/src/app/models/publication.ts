import { User } from "./user";

export class Publication{

    constructor(
        
        public text: string,
        public surname: string,
        public file: string,
        public userID: string,
        public createdAt: string

    ){}

}