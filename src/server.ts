import express from "express";
import mongoose from "mongoose";

import compression from "compression";
import cors from "cors";

import { MONGODB_URI } from "./util/secrets";

import { ProductRoutes } from "./routes/productRoutes";
import { UserRoutes } from "./routes/userRoutes";

class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.mongo();
  }

  public routes(): void {
    this.app.use("/api/user", new UserRoutes().router);
    this.app.use("/api/products", new ProductRoutes().router);
    this.app.use("/api/productsdeny", new ProductRoutes().router);
  }

  public config(): void {
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(compression());
    this.app.use(cors());
  }

  private  mongo() {
    const mongoUrl = MONGODB_URI;
    mongoose.Promise = Promise;
    mongoose.connection.on("connected", () => {
      console.log("Mongo Connection Established");
    });
    mongoose.connection.on("reconnected", () => {
      console.log("Mongo Connection Reestablished");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Mongo Connection Disconnected");
    });
    mongoose.connection.on("close", () => {
      console.log("Mongo Connection Closed");
    });
    mongoose.connection.on("error", (error: Error) => {
      console.log("Mongo Connection ERROR: " + error);
    });

    const run = async () => {
      await mongoose.connect(mongoUrl, {
        autoReconnect: true,
        reconnectTries: 1000,
        reconnectInterval: 2
      });
    };
     run().catch(error => console.error(error));
  }

  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log(
        "  API is running at http://localhost:%d",
        this.app.get("port")
      );
    });
  }

}

const server = new Server();

server.start();
