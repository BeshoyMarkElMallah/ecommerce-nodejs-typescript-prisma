import { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/users";

import { Address, User } from "@prisma/client";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-requests";

export const addAddress = async (req: Request, res: Response) => {
    AddressSchema.parse(req.body);
    let user: User;

    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            userId: (req as any).user.id
        }
    });

    res.json(address);
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        await prismaClient.address.delete({
            where: {
                id: +req.params.id
            }
        });
        res.status(200).json({ success: true, message: "Address Deleted Successfully" })
    } catch (error) {
        throw new NotFoundException("Address not found", ErrorCodes.ADDRESS_NOT_FOUND);
    }
}

export const listAddress = async (req: Request, res: Response) => {
    const addresses = await prismaClient.address.findMany({
        where: {
            userId: (req as any).user.id
        }
    });

    res.json(addresses);
}

export const updateUser = async (req: Request, res: Response) => {
    const validatedData = UpdateUserSchema.parse(req.body);
    let shippingAddress: Address;
    let billingAddress: Address;
    if (validatedData.defaultShippingAddress) {
        try {
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress!
                }
            });


        } catch (error) {
            throw new NotFoundException("Address not found", ErrorCodes.ADDRESS_NOT_FOUND);

        }
        if (shippingAddress.userId != (req as any).user?.id) {
            throw new BadRequestsException("Address does not belong to user", ErrorCodes.ADDRESS_DOES_NOT_BELONG);
        }
    }
    if (validatedData.defaultBillingAddress) {
        try {
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress!
                }
            });

        } catch (error) {
            throw new NotFoundException("Address not found", ErrorCodes.ADDRESS_NOT_FOUND);

        }
        if (billingAddress.userId != (req as any).user?.id) {
            throw new BadRequestsException("Address does not belong to user", ErrorCodes.ADDRESS_DOES_NOT_BELONG);
        }
    }

    const updatedUser = await prismaClient.user.update({
        where: {
            id: (req as any).user.id

        },
        data: validatedData as any
    });
    res.json(updatedUser);
}



export const listUsers = async (req: Request, res: Response) => {
    const users = await prismaClient.user.findMany({
        skip: +(req as any).query.skip || 0,
        take: 5
    });
    res.json(users);
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await prismaClient.user.findFirstOrThrow({
            where: {
                id: +req.params.id
            },
            include: {
                addresses: true

            }

        });
        res.json(user);
    } catch (error) {
        throw new NotFoundException("User not found", ErrorCodes.USER_NOT_FOUND);
    }
}

export const changeUserRole = async (req: Request, res: Response) => {
    try {
        const user = await prismaClient.user.update({
            where: {
                id: +req.params.id
            },
            data: {
                role: req.body.role
            }

        });
        res.json(user);
    } catch (error) {
        throw new NotFoundException("User not found", ErrorCodes.USER_NOT_FOUND);
    }
}