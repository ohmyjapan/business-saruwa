// server/api/products/index.get.ts
import { defineEventHandler } from 'h3';
import { connectToDatabase } from '~/server/utils/mongodb';
import { Product } from '~/server/models/product';

export default defineEventHandler(async (event) => {
    try {
        await connectToDatabase();

        // Get query parameters for filtering
        const query = getQuery(event);

        // Build filter object
        const filter: any = {};

        if (query.category) {
            filter.category = query.category;
        }

        if (query.search) {
            filter.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { description: { $regex: query.search, $options: 'i' } },
                { sku: { $regex: query.search, $options: 'i' } },
                { janCode: { $regex: query.search, $options: 'i' } }
            ];
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return {
            statusCode: 500,
            body: { error: 'Failed to fetch products' }
        };
    }
});