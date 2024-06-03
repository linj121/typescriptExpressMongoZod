import { Request, Response } from "express";
import { 
  CreateProductInput, 
  DeleteProductInput, 
  GetProductInput, 
  UpdateProductInput 
} from "../schema/product.schema";
import {
  createProduct,
  findProduct,
  findAndUpdateProduct,
  deleteProduct
} from "../service/product.service"

/**
 * Insert product payload associated with the authed user.
 * User id taken from `locals.user._id` provided by deserializer middleware,
 * @param req 
 * @param res 
 */
export async function createProductHandler(
  req: Request<{}, {}, CreateProductInput["body"]>, 
  res: Response
) {
  const userId = res.locals.user._id;
  
  const body = req.body;

  const product = await createProduct({...body, user: userId});

  return res.send(product.toJSON());
}

export async function updateProductHandler(
  req: Request<UpdateProductInput["params"], {}, UpdateProductInput["body"]>, 
  res: Response
) {
  const userId: string = res.locals.user._id;

  const productId = req.params.productId;

  const update = req.body;

  const product = await findProduct({ productId });

  /**
   * Make sure the product exists
   */
  if (!product) {
    return res.sendStatus(404);
  }

  /**
   * User who trying to access the product !== user who owns it
   */
  if (String(product.user) !== userId) {
    return res.sendStatus(403);
  }

  const updatedProduct = await findAndUpdateProduct({ productId }, update, { new: true });

  return res.send(updatedProduct);
}

export async function getProductHandler(
  req: Request<GetProductInput["params"]>, 
  res: Response
) {
  const productId = req.params.productId;

  const product = await findProduct({ productId });
  
  if (!product) return res.sendStatus(404);

  res.send(product);
}

export async function deleteProductHandler(
  req: Request<DeleteProductInput["params"]>, 
  res: Response
) {
  const userId: string = res.locals.user._id;

  const productId = req.params.productId;

  const product = await findProduct({ productId });

  /**
   * Make sure the product exists
   */
  if (!product) {
    return res.sendStatus(404);
  }

  /**
   * User who trying to access the product !== user who owns it
   */
  if (String(product.user) !== userId) {
    return res.sendStatus(403);
  }

  await deleteProduct({ productId });

  return res.sendStatus(200);
}