/**
 * @author Aman kumar singh
 * @description
 */
import { Request, Response } from "express";

import * as redFlagService from "./redFlag.service";

import { sendResponse } from "../../common/http/apiResponse";


export const searchUser = async (
    req: Request,
    res: Response
) => {

    try {

        const user =
            await redFlagService.findUserForFlag(
                req.body.identifier
            );

        return sendResponse(
            res,
            200,
            user,
            "User found"
        );

    } catch (error: any) {

        return sendResponse(
            res,
            400,
            null,
            error.message
        );
    }
};


export const createFlag = async (
    req: any,
    res: Response
) => {

    try {

        const result =
            await redFlagService.addRedFlag(
                req.body,
                req.user.userId
            );

        return sendResponse(
            res,
            201,
            result,
            "Red Flag added successfully"
        );

    } catch (error: any) {

        return sendResponse(
            res,
            400,
            null,
            error.message
        );
    }
};


export const getRedFlags = async (
    req: any,
    res: Response
) => {

    try {

        const search =
            req.query.search || "";

        const result =
            await redFlagService.getRedFlagList(
                search,
                req.pagination.limit
            );

        return sendResponse(
            res,
            200,
            result,
            "Red flag list fetched successfully"
        );

    } catch (error: any) {

        return sendResponse(
            res,
            400,
            null,
            error.message
        );
    }
};

export const removeFlag = async (
    req: Request,
    res: Response
) => {

    try {

        const result =
            await redFlagService.removeRedFlag(
                req.params.id as string
            );

        return sendResponse(
            res,
            200,
            result,
            "Red flag removed successfully"
        );

    } catch (error: any) {

        return sendResponse(
            res,
            400,
            null,
            error.message
        );
    }
};