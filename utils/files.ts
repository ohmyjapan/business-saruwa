import { writeFile, mkdir, unlink } from 'fs/promises';
import { dirname, join, extname, parse } from 'path';
import { existsSync } from 'fs';
import { randomUUID } from 'crypto';
import * as sharp from 'sharp';

/**
 * Ensure a directory exists, creating it if necessary
 */
export async function ensureDir(dirPath: string): Promise<void> {
    if (!existsSync(dirPath)) {
        await mkdir(dirPath, { recursive: true });
    }
}

/**
 * Generate a unique filename with the original extension
 */
export function generateUniqueFilename(originalFilename: string): string {
    const ext = extname(originalFilename);
    return `${randomUUID()}${ext}`;
}

/**
 * Save an uploaded file to disk
 */
export async function saveUploadedFile(
    fileBuffer: Buffer,
    originalFilename: string,
    uploadDir: string,
    customFilename?: string
): Promise<string> {
    // Ensure the upload directory exists
    await ensureDir(uploadDir);

    // Generate a unique filename or use the provided custom name
    const filename = customFilename || generateUniqueFilename(originalFilename);

    // Create the full path
    const filePath = join(uploadDir, filename);

    // Write the file
    await writeFile(filePath, fileBuffer);

    // Return the filename (not the full path)
    return filename;
}

/**
 * Process an image - resize and optimize
 */
export async function processImage(
    fileBuffer: Buffer,
    options: {
        width?: number;
        height?: number;
        quality?: number;
        format?: 'jpeg' | 'png' | 'webp';
    } = {}
): Promise<Buffer> {
    let processor = sharp(fileBuffer);

    // Resize if dimensions are provided
    if (options.width || options.height) {
        processor = processor.resize({
            width: options.width,
            height: options.height,
            fit: 'inside',
            withoutEnlargement: true
        });
    }

    // Set format and quality
    if (options.format === 'jpeg') {
        processor = processor.jpeg({ quality: options.quality || 80 });
    } else if (options.format === 'png') {
        processor = processor.png({ quality: options.quality || 80 });
    } else if (options.format === 'webp') {
        processor = processor.webp({ quality: options.quality || 80 });
    }

    // Process and return the buffer
    return await processor.toBuffer();
}

/**
 * Process and save an image with different sizes
 */
export async function processAndSaveImage(
    fileBuffer: Buffer,
    originalFilename: string,
    uploadDir: string,
    sizes: Array<{name: string; width: number; height?: number}> = []
): Promise<Record<string, string>> {
    const fileInfo = parse(originalFilename);
    const baseFilename = generateUniqueFilename(originalFilename);
    const results: Record<string, string> = {};

    // Save the original image
    results.original = await saveUploadedFile(
        fileBuffer,
        originalFilename,
        uploadDir,
        baseFilename
    );

    // Process and save images in different sizes
    for (const size of sizes) {
        try {
            const processed = await processImage(fileBuffer, {
                width: size.width,
                height: size.height,
                format: 'webp',
                quality: 80
            });

            const sizeFilename = `${fileInfo.name}_${size.name}.webp`;
            results[size.name] = await saveUploadedFile(
                processed,
                sizeFilename,
                uploadDir,
                `${parse(baseFilename).name}_${size.name}.webp`
            );
        } catch (error) {
            console.error(`Error processing image size ${size.name}:`, error);
        }
    }

    return results;
}

/**
 * Process and save multiple uploaded product images
 */
export async function processUploadedProductImages(
    files: Array<{ buffer: Buffer, originalname: string }>,
    uploadDir: string,
    janCode?: string
): Promise<Array<{
    id: string;
    src: string;
    srcset?: Record<string, string>;
    alt: string;
    isDefault: boolean;
}>> {
    const results: Array<{
        id: string;
        src: string;
        srcset?: Record<string, string>;
        alt: string;
        isDefault: boolean;
    }> = [];

    // Create a subdirectory for the JAN code if provided
    const targetDir = janCode
        ? join(uploadDir, 'products', janCode)
        : join(uploadDir, 'products');

    // Ensure the directory exists
    await ensureDir(targetDir);

    // Define image sizes to generate
    const sizes = [
        { name: 'thumbnail', width: 150 },
        { name: 'small', width: 300 },
        { name: 'medium', width: 600 },
        { name: 'large', width: 1200 }
    ];

    // Process each file
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
            const processedImages = await processAndSaveImage(
                file.buffer,
                file.originalname,
                targetDir,
                sizes
            );

            // Generate paths for each size
            const imagePaths: Record<string, string> = {};
            for (const [size, filename] of Object.entries(processedImages)) {
                imagePaths[size] = janCode
                    ? `products/${janCode}/${filename}`
                    : `products/${filename}`;
            }

            // Add to results array
            results.push({
                id: randomUUID(),
                src: imagePaths.original,
                srcset: {
                    thumbnail: imagePaths.thumbnail,
                    small: imagePaths.small,
                    medium: imagePaths.medium,
                    large: imagePaths.large
                },
                alt: parse(file.originalname).name,
                isDefault: i === 0 // First image is default
            });
        } catch (error) {
            console.error(`Error processing file ${file.originalname}:`, error);
        }
    }

    return results;
}

/**
 * Delete a file from disk
 */
export async function deleteFile(filePath: string): Promise<boolean> {
    try {
        await unlink(filePath);
        return true;
    } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
        return false;
    }
}