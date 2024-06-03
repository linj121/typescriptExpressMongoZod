import mongoose, { DocumentDefinition } from "mongoose";
import { customAlphabet } from "nanoid";
import { UserDocument } from "./user.model";

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

export interface ProductDocument extends mongoose.Document {
  productId:   string;
  user:        UserDocument["_id"];
  title:       string;
  description: string;
  price:       number;
  image:       string;
  createdAt:   Date;
  updatedAt:   Date;
}

export type ProductInput =
  DocumentDefinition<Omit<ProductDocument, "productId" | "createdAt" | "updatedAt">>

const productSchema = new mongoose.Schema<ProductDocument>(
  {
    productId: { 
      type: String,
      required: true,
      unique: true,
      /**
       * setup an id each time when creating a document from ProductModel
       * https://mongoosejs.com/docs/defaults.html
       */
      default: () => `product_${nanoid()}`
    },
    user:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);

export default ProductModel;
