import { Injectable, Post } from "@nestjs/common";
import { DatabaseConnectionService } from "src/database_connection/database_connection.service";

@Injectable({})
export class AuthService {
    constructor(private prisma:DatabaseConnectionService) {

    }
    signup() {
        return { msg: 'I have signed up'};
    }
    signin() {
        return { msg: 'I have signed in' };

    }
}