import { Request, Response, NextFunction } from "express";

import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../util/secrets";
import bcrypt from "bcrypt-nodejs";
import passport from "passport";
import { User } from "../models/user";
import "../auth/passportHandler";

export class AuthController {

  public async registerUser(req: Request, res: Response): Promise<void> {
    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    await User.create({
      username: req.body.username,
      password: hashedPassword,

    });

    const token = jwt.sign({ username: req.body.username, }, JWT_SECRET);
    res.status(200).send({ token: token });
  }

  public authenticateUser(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("local", function (err, user, info) {
      // no async/await because passport works only with callback ..
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ status: "error", code: "unauthorized" });
      } else {
        const token = jwt.sign({ username: user.username }, JWT_SECRET);
        res.status(200).send({ token: token });
      }
    });
  }


  public authenticateJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate("jwt", function (err, user, info) {
      if (err) {
        console.log(err);
        return res.status(401).json({ status: "error", code: "unauthorized" });
      }
      if (!user) {
        return res.status(401).json({ status: "error", code: "unauthorized" });
      } else {
        return next();
      }
    })(req, res, next);
  }



}