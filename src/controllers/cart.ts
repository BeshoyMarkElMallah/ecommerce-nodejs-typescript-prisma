import { Request, response, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";

export const addItemToCart = async (req: Request, res: Response) => {
    const validatedData = CreateCartSchema.parse(req.body);
    let product: Product;
    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        })
    } catch (error) {
        throw new NotFoundException("Product not found", ErrorCodes.PRODUCT_NOT_FOUND);
    }

    const cart = await prismaClient.cartItem.create({
        data: {
            userId: (req as any).user?.id,
            productId: product.id,
            quantity: validatedData.quantity
        }
    });
    res.json(cart);
}

export const deleteItemFromCart = async (req: Request, res: Response) => {


    await prismaClient.cartItem.delete({
        where: {
            id: +req.params.id
        }
    });
    res.json({ message: "Cart Item deleted successfully", success: true });
}

export const changeQuantity = async (req: Request, res: Response) => {
    const validatedData = ChangeQuantitySchema.parse(req.body);
    const updatedCart = await prismaClient.cartItem.update({
        where: {
            id: +req.params.id
        },
        data: {
            quantity: validatedData.quantity
        }

    });
    res.json(updatedCart);
}

export const getCart = async (req: Request, res: Response) => { 
    const cartItems = await prismaClient.cartItem.findMany({
        where: {
            userId: (req as any).user?.id
        },
        include: {
            product: true
        }
    });
    res.json(cartItems);
}

