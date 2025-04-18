import { defineEventHandler, readBody, setCookie } from 'h3';
import { randomUUID } from 'crypto';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    // Validate required fields
    if (!body.email || !body.password || !body.companyName || !body.contactName) {
        return {
            success: false,
            message: 'Missing required fields',
            errors: {
                email: !body.email ? 'Email is required' : null,
                password: !body.password ? 'Password is required' : null,
                companyName: !body.companyName ? 'Company name is required' : null,
                contactName: !body.contactName ? 'Contact name is required' : null
            }
        };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
        return {
            success: false,
            message: 'Invalid email format',
            errors: {
                email: 'Please enter a valid email address'
            }
        };
    }

    // Validate password strength
    if (body.password.length < 6) {
        return {
            success: false,
            message: 'Password too short',
            errors: {
                password: 'Password must be at least 6 characters long'
            }
        };
    }

    // In a real application, you would:
    // 1. Check if email already exists
    // 2. Hash the password
    // 3. Save user to database
    // 4. Send verification email

    // For this mock implementation, we'll simulate successful registration

    // Create a user object (in a real app, this would be saved to a database)
    const newUser = {
        id: randomUUID(),
        email: body.email,
        companyName: body.companyName,
        contactName: body.contactName,
        businessType: body.businessType || '',
        taxId: body.taxId || '',
        phone: body.phone || '',
        role: 'customer', // Default role for new registrations
        isApproved: false, // For wholesale sites, you might want admin approval before activation
        createdAt: new Date().toISOString()
    };

    // For demo purposes, auto-approve certain emails (for testing)
    if (body.email === 'admin@example.com') {
        newUser.role = 'admin';
        newUser.isApproved = true;

        // Set admin auth token
        setCookie(event, 'auth-token', 'admin-token', {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });
    } else if (body.email.endsWith('@example.com')) {
        newUser.isApproved = true;

        // Set regular user auth token
        setCookie(event, 'auth-token', 'user-token', {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });
    }

    // Return success response
    // In a real app, you might want to filter out sensitive data like password hash
    return {
        success: true,
        message: newUser.isApproved
            ? 'Registration successful! You can now log in.'
            : 'Registration successful! Your account will be reviewed by an administrator.',
        user: {
            id: newUser.id,
            email: newUser.email,
            companyName: newUser.companyName,
            contactName: newUser.contactName,
            role: newUser.role,
            isApproved: newUser.isApproved
        }
    };
});