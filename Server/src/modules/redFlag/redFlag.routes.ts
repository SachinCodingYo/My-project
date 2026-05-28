/**
 * @author Aman kumar singh
 * @description
 */
import { Router } from "express";

import {searchUser, createFlag, getRedFlags, removeFlag} from "./redFlag.controller";

import {authMiddleware, authorize} from "../../common/middlewares/auth.middleware";

import { paginationMiddleware } from "../../common/middlewares/cursorPagination.middleware";

const router = Router();

router.post("/search", authMiddleware, authorize("ADMIN"), searchUser);


router.post("/add",authMiddleware, authorize("ADMIN"), createFlag);


router.get("/list",authMiddleware, authorize("ADMIN"), paginationMiddleware, getRedFlags);


router.patch("/:id/remove", authMiddleware, authorize("ADMIN"), removeFlag);

export default router;