// server/api/products/[id].delete.ts
import { defineEventHandler } from 'h3';
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

        // Check if product exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return {
                statusCode: 404,
                body: { error: 'Product not found' }
            };
        }

        // Delete product
        await Product.findByIdAndDelete(id);

        return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
        console.error(`Error deleting product ${event.context.params?.id}:`, error);
        return {
            statusCode: 500,
            body: { error: 'Failed to delete product' }
        };
    }
});