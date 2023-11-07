import { Controller, Post, Body, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('signin')
    signup(@Req() req: Request) {
        console.log(req.body)
        return this.authService.signin();
    }
    @Post('signup')
    login(@Body() dto: AuthDto) {
        console.log({
            dto,
        })
        return this.authService.signup();
    }
}
