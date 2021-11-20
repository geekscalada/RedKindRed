export class User{

    constructor(
        //#cambiar creo que este _id ya no hace falta
        public _id: string,
        public name: string,
        public surname: string,
        public nick: string,
        public email: string,
        public password: string,
        public role: string,
        public image: string

    ){}

}

