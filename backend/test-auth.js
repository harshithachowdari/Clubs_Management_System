"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const auth_service_1 = require("./src/auth/auth.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const authService = app.get(auth_service_1.AuthService);
    console.log('Testing validateUser...');
    try {
        const user = await authService.validateUser('test@vignan.ac.in', 'password123');
        console.log('validateUser Result:', user);
        if (user) {
            console.log('Testing login(user)...');
            const loginResult = await authService.login(user);
            console.log('login Result:', loginResult);
        }
        else {
            console.log('User not found or password incorrect');
        }
    }
    catch (error) {
        console.error('Error during auth testing:', error);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=test-auth.js.map