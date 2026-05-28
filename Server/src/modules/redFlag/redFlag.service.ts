/**
 * @author Aman kumar singh
 * @description
 */
import { UserModel } from "../auth/auth.model";
import { RedFlagModel } from "./redFlag.model";

// 1. Search User (by Email or Mobile)

export const findUserForFlag = async (identifier: string) => {

    const user = await UserModel.findOne({
        $or: [
            { email: identifier },
            { mobile: identifier }
        ]
    }).select("fullName email mobile role");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};



// 2. Add Red Flag

export const addRedFlag = async (
    data: any,
    adminId: string
) => {

    const user = await findUserForFlag(
        data.identifier
    );

    // CHECK EXISTING ACTIVE FLAG

    const existingFlag = await RedFlagModel.findOne({
        userId: user._id,
        isActive: true
    });

    if (existingFlag) {
        throw new Error(
            "User already has an active red flag"
        );
    }

    // CREATE NEW FLAG

    return await RedFlagModel.create({

        userId: user._id,

        reason: data.reason,

        remarks: data.remarks,

        flaggedBy: adminId,

        isActive: true
    });
};



// 3. GET RED FLAG LIST

export const getRedFlagList = async (
    search: string,
    limit: number
) => {

    let query: any = {
        isActive: true
    };

    // SEARCH FILTER

    if (search) {

        const users = await UserModel.find({

            $or: [

                {
                    fullName: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    mobile: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ]

        }).select("_id");

        query.userId = {
            $in: users.map((u) => u._id)
        };
    }

    // FETCH DATA

    const data = await RedFlagModel.find(query)

        .populate(
            "userId",
            "fullName email mobile role"
        )

        .populate(
            "flaggedBy",
            "fullName"
        )

        .sort({
            createdAt: -1
        })

        .limit(limit);

    return data;
};



// 4. REMOVE RED FLAG (SOFT DELETE)

export const removeRedFlag = async (
    id: string
) => {

    const redFlag = await RedFlagModel.findById(id);

    if (!redFlag) {
        throw new Error("Red flag not found");
    }

    // SOFT DELETE

    redFlag.isActive = false;

    await redFlag.save();

    return redFlag;
};