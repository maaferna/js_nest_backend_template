import { Injectable, Post } from "@nestjs/common";
import { DatabaseConnectionService } from "src/database_connection/database_connection.service";
import { AuthDto } from "./dto";

@Injectable({})
export class AuthService {
    constructor(private prisma:DatabaseConnectionService) {

    }
    signup(dto: AuthDto) {
        return { msg: 'I have signed up'};
    }
    signin() {
        return { msg: 'I have signed in' };

    }
}