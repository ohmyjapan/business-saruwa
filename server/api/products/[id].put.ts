// server/api/products/[id].put.ts
import { defineEventHandler, readBody } from 'h3';
import { connectToDatabase } from '~/server/utils/mongodb';
import { Product } from '~/server/models/product';

export default defineEventHandler(async (event) => {
    try {
        await connectToDatabase();

        const id = event.context.params?.id;
        if (!id) {
            return {
                statusCode: 400,
                body: { error: 'Product ID is required' }
            };
        }

        const body = await readBody(event);

        // Check if product exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return {
                statusCode: 404,
                body: { error: 'Product not found' }
            };
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        return updatedProduct;
    } catch (error) {
        console.error(`Error updating product ${event.context.params?.id}:`, error);
        return {
            statusCode: 500,
            body: { error: 'Failed to update product' }
        };
    }
});