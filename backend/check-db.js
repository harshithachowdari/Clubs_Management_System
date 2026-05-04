"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./src/app.module");
const users_service_1 = require("./src/users/users.service");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const usersService = app.get(users_service_1.UsersService);
    console.log('Fetching users...');
    try {
        const users = await usersService.findAll();
        console.log('Users found:', users.length);
        if (users.length > 0) {
            console.log('First user:', {
                email: users[0].email,
                role: users[0].role,
                id: users[0]._id
            });
        }
    }
    catch (error) {
        console.error('Error fetching users:', error);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=check-db.js.map