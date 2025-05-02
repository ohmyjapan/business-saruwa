// server/api/admin/products/clean-test-items.post.ts
import { defineEventHandler, readBody } from 'h3';
import mongoose from 'mongoose';
import { Product } from '~/server/models/product';

export default defineEventHandler(async (event) => {
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!mongoose.connection.readyState) {
            if (!MONGODB_URI) {
                throw new Error('MongoDB URI is not defined in environment variables');
            }
            await mongoose.connect(MONGODB_URI);
        }

        const body = await readBody(event);
        const patterns = body.patterns || [];

        if (!patterns.length) {
            return {
                success: false,
                message: 'No patterns provided',
                totalFound: 0,
                deletedCount: 0
            };
        }

        // Build regex query for text fields
        const orConditions = patterns.flatMap(pattern => [
            { name: { $regex: pattern, $options: 'i' } },
            { sku: { $regex: pattern, $options: 'i' } },
            { description: { $regex: pattern, $options: 'i' } }
        ]);

        // Find matching products
        const query = { $or: orConditions };
        const matchingProducts = await Product.find(query).select('_id name').lean();

        console.log(`Found ${matchingProducts.length} products matching patterns:`, patterns);

        if (matchingProducts.length === 0) {
            return {
                success: true,
                message: 'No matching test products found',
                totalFound: 0,
                deletedCount: 0
            };
        }

        // Delete the matching products
        const deleteResult = await Product.deleteMany(query);

        return {
            success: true,
            message: `Successfully deleted ${deleteResult.deletedCount} test products`,
            totalFound: matchingProducts.length,
            deletedCount: deleteResult.deletedCount || 0,
            productNames: matchingProducts.slice(0, 10).map(p => p.name) // For debugging
        };
    } catch (error) {
        console.error('Error cleaning up test products:', error);

        return {
            success: false,
            message: `Error: ${error.message}`,
            totalFound: 0,
            deletedCount: 0,
            error: error.message
        };
    }
});