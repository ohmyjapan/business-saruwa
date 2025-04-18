import { defineEventHandler, getCookie, createError } from 'h3';

export default defineEventHandler((event) => {
    // In a real application, you would validate JWT tokens or session cookies

    // Sample authentication middleware
    console.log('Auth middleware running');

    // Get the request path
    const path = event.node.req.url || '';

    // For development only: Allow all routes without authentication
    // Remove or modify this condition when implementing real authentication
    if (process.env.NODE_ENV === 'development') {
        console.log('Development mode - skipping authentication checks');
        return;
    }

    // Skip auth for public routes
    if (
        path.startsWith('/api/auth') ||
        path.startsWith('/api/products') && !path.includes('admin') ||
        path.startsWith('/api/public')
    ) {
        return;
    }

    // Check for auth token (in a real app, this would be a JWT)
    const authToken = getCookie(event, 'auth-token');

    // For admin routes, enforce stricter auth
    if (path.includes('/api/admin')) {
        // Check if user is admin (this is a simplified example)
        const isAdmin = authToken === 'admin-token';

        if (!authToken || !isAdmin) {
            throw createError({
                statusCode: 403,
                message: 'Unauthorized access to admin resource'
            });
        }
    }

    // For protected non-admin routes
    if (!authToken) {
        throw createError({
            statusCode: 401,
            message: 'Authentication required'
        });
    }
});