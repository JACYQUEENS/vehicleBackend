import { Hono } from "hono";
import * as UserController from './users.controller.ts'

const UserRoutes = new Hono();
//GETTING ALL USERS
UserRoutes.get("/users", UserController.getAllUsers);

//GETTING USERS BYID
UserRoutes.get("/users/:user_id", UserController.getUserById);

//UPDATING USER
UserRoutes.put("/users/:user_id", UserController.updateUser);

//DELEATING USER
UserRoutes.delete("/users/:user_id", UserController.deleteUser);

export default UserRoutes;
