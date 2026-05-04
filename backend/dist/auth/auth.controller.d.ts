import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            rollNumber: any;
            department: any;
            profileImage: any;
        };
    }>;
    login(req: any, loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            rollNumber: any;
            department: any;
            profileImage: any;
        };
    }>;
    getProfile(req: any): any;
    validate(req: any): Promise<{
        valid: boolean;
        user: any;
    }>;
}
