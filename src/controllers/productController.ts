
import { Request, Response } from "express";
import { Product, IProduct } from "../models/product";

export class ProductController {

    public async getProducts(req: Request, res: Response): Promise<void> {
        const products = await Product.find();
        res.json({ products });
    }

    public async getProduct(req: Request, res: Response): Promise<void> {
        const product = await Product.find({ productId: req.params.id });
        res.json(product);
    }

    public async createProduct(req: Request, res: Response): Promise<void> {
        const newProduct: IProduct = new Product(req.body);
        await newProduct.save();
        res.json({ status: res.status, data: newProduct });

    }

    public async updateProduct(req: Request, res: Response): Promise<void> {
        const product = await Product.findOneAndUpdate({ productId: req.params.id }, req.body);
        res.json({ status: res.status, data: product });
    }

    public async deleteProduct(req: Request, res: Response): Promise<void> {
        await Product.findOneAndDelete({ productId: req.params.id });
        res.json({ response: "Product deleted Successfully" });
    }
}