import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    // Get product ID from route parameter
    const id = event.context.params?.id;
    console.log('API endpoint called for product ID:', id);

    if (!id) {
        return {
            statusCode: 400,
            body: { error: 'Product ID is required' }
        };
    }

    try {
        // In a real app, fetch from database
        // For now, let's simulate fetching from storage
        const storage = useStorage('products');
        let product = await storage.getItem(`product:${id}`);

        // If not found by exact key, try to find by id property
        if (!product) {
            // Try to get all products and find the one matching the ID
            const allProducts = await storage.getItem('products');
            if (Array.isArray(allProducts)) {
                product = allProducts.find(p => p.id === id);
            }
        }

        console.log('Found product:', product);

        if (!product) {
            return {
                statusCode: 404,
                body: { error: 'Product not found' }
            };
        }

        return product;
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return {
            statusCode: 500,
            body: { error: 'Failed to fetch product' }
        };
    }
});