import { Router } from "express";
import { AuthController } from "../controllers/authController";

export class AuthRoutes {

    router: Router;
    public authController: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post("/register", this.authController.registerUser);
        this.router.post("/login", this.authController.authenticateUser);
    }
}