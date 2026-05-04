"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const clubs_service_1 = require("./clubs.service");
const clubs_controller_1 = require("./clubs.controller");
const club_schema_1 = require("./schemas/club.schema");
const users_module_1 = require("../users/users.module");
const memberships_module_1 = require("../memberships/memberships.module");
let ClubsModule = class ClubsModule {
};
exports.ClubsModule = ClubsModule;
exports.ClubsModule = ClubsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: club_schema_1.Club.name, schema: club_schema_1.ClubSchema }]),
            users_module_1.UsersModule,
            memberships_module_1.MembershipsModule,
        ],
        controllers: [clubs_controller_1.ClubsController],
        providers: [clubs_service_1.ClubsService],
        exports: [clubs_service_1.ClubsService],
    })
], ClubsModule);
//# sourceMappingURL=clubs.module.js.map