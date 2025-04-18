import { defineEventHandler, readBody, setCookie } from 'h3';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    // Very simple mock authentication
    // In a real app, you would validate against a database
    if (body.email === 'admin@example.com' && body.password === 'password123') {
        // Set a cookie for authentication
        setCookie(event, 'auth-token', 'admin-token', {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return {
            success: true,
            user: {
                email: body.email,
                name: 'Admin User',
                role: 'admin'
            }
        };
    } else if (body.email && body.password) {
        // Regular user login
        setCookie(event, 'auth-token', 'user-token', {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return {
            success: true,
            user: {
                email: body.email,
                name: 'Test User',
                role: 'user'
            }
        };
    }

    return {
        success: false,
        message: 'Invalid credentials'
    };
});