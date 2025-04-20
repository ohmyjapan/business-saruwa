// server/api/products/index.post.ts
import { defineEventHandler, readBody } from 'h3';
import { connectToDatabase } from '~/server/utils/mongodb';
import { Product } from '~/server/models/product';

export default defineEventHandler(async (event) => {
    try {
        await connectToDatabase();

        const body = await readBody(event);

        // Basic validation
        if (!body.name || !body.janCode || !body.sku || !body.pricing?.basePrice) {
            return {
                statusCode: 400,
                body: { error: 'Missing required fields' }
            };
        }

        // Check for duplicate JAN code
        const existingProduct = await Product.findOne({ janCode: body.janCode });
        if (existingProduct) {
            return {
                statusCode: 400,
                body: { error: 'Product with this JAN code already exists' }
            };
        }

        const newProduct = new Product(body);
        await newProduct.save();

        return newProduct;
    } catch (error) {
        console.error('Error creating product:', error);
        return {
            statusCode: 500,
            body: { error: 'Failed to create product' }
        };
    }
});