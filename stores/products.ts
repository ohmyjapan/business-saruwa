// stores/products.ts
import { defineStore } from 'pinia';
import type { Product, ProductImage, ProductFilter } from '~/types';

export const useProductStore = defineStore('products', {
    state: () => ({
        products: [] as Product[],
        featuredProducts: [] as Product[],
        newArrivals: [] as Product[],
        currentProduct: null as Product | null,
        loading: false,
        error: null as string | null,
        categories: [] as string[],
        brands: [] as string[],
        filters: {
            categories: [],
            brands: [],
            tags: [],
            minPrice: 0,
            maxPrice: 0,
            inStock: false,
            query: ''
        } as ProductFilter
    }),

    getters: {
        getProductById: (state) => (id: string) => {
            return state.products.find(p => p.id === id) || null;
        },

        getProductsByCategory: (state) => (category: string) => {
            return state.products.filter(p => p.category === category && p.isActive);
        },

        getActiveProducts: (state) => {
            return state.products.filter(p => p.isActive);
        },

        filteredProducts: (state) => {
            let filtered = state.products.filter(p => p.isActive);

            // Apply category filter
            if (state.filters.categories && state.filters.categories.length > 0) {
                filtered = filtered.filter(p => state.filters.categories.includes(p.category));
            }

            // Apply brand filter
            if (state.filters.brands && state.filters.brands.length > 0) {
                filtered = filtered.filter(p => state.filters.brands.includes(p.brand));
            }

            // Apply tags filter
            if (state.filters.tags && state.filters.tags.length > 0) {
                filtered = filtered.filter(p =>
                    p.tags.some(tag => state.filters.tags.includes(tag))
                );
            }

            // Apply price range filter
            if (state.filters.minPrice > 0) {
                filtered = filtered.filter(p => p.pricing.basePrice >= state.filters.minPrice);
            }

            if (state.filters.maxPrice > 0) {
                filtered = filtered.filter(p => p.pricing.basePrice <= state.filters.maxPrice);
            }

            // Apply in-stock filter
            if (state.filters.inStock) {
                filtered = filtered.filter(p => p.stock > 0);
            }

            // Apply search query
            if (state.filters.query) {
                const query = state.filters.query.toLowerCase();
                filtered = filtered.filter(p =>
                    p.name.toLowerCase().includes(query) ||
                    p.description.toLowerCase().includes(query) ||
                    p.janCode.toLowerCase().includes(query) ||
                    p.sku.toLowerCase().includes(query) ||
                    p.brand.toLowerCase().includes(query) ||
                    p.tags.some(tag => tag.toLowerCase().includes(query))
                );
            }

            return filtered;
        },

        priceRange: (state) => {
            if (state.products.length === 0) return { min: 0, max: 0 };

            const prices = state.products
                .filter(p => p.isActive)
                .map(p => p.pricing.basePrice);

            return {
                min: Math.min(...prices),
                max: Math.max(...prices)
            };
        }
    },

    actions: {
        async fetchProducts() {
            this.loading = true;
            this.error = null;

            try {
                const { data } = await useFetch('/api/products');
                this.products = data.value as Product[];

                // Extract featured products
                this.featuredProducts = this.products.filter(p => p.isFeatured && p.isActive);

                // Extract new arrivals
                this.newArrivals = this.products
                    .filter(p => p.isNew && p.isActive)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                // Extract unique categories
                const uniqueCategories = new Set<string>();
                this.products.forEach(p => {
                    if (p.category) uniqueCategories.add(p.category);
                });
                this.categories = Array.from(uniqueCategories);

                // Extract unique brands
                const uniqueBrands = new Set<string>();
                this.products.forEach(p => {
                    if (p.brand) uniqueBrands.add(p.brand);
                });
                this.brands = Array.from(uniqueBrands);

                // Set initial price range for filters
                this.filters.minPrice = this.priceRange.min;
                this.filters.maxPrice = this.priceRange.max;
            } catch (error: any) {
                this.error = error.message || 'Failed to fetch products';
                console.error('Error fetching products:', error);
            } finally {
                this.loading = false;
            }
        },

        async fetchProductById(id: string) {
            this.loading = true;
            this.error = null;

            try {
                console.log('Fetching product with ID:', id);
                const { data } = await useFetch(`/api/products/${id}`);

                if (data.value) {
                    // Store the product in the currentProduct ref
                    this.currentProduct = data.value as Product;

                    // Also add it to the products array if it's not already there
                    const existingIndex = this.products.findIndex(p => p.id === id);
                    if (existingIndex >= 0) {
                        // Update existing product
                        this.products[existingIndex] = this.currentProduct;
                    } else {
                        // Add new product
                        this.products.push(this.currentProduct);
                    }

                    return this.currentProduct;
                } else {
                    this.error = 'Product not found';
                    return null;
                }
            } catch (error: any) {
                this.error = error.message || `Failed to fetch product with ID: ${id}`;
                console.error(`Error fetching product ${id}:`, error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async uploadProductsFromExcel(file: File) {
            this.loading = true;
            this.error = null;

            try {
                const formData = new FormData();
                formData.append('file', file);

                const { data } = await useFetch('/api/admin/products', {
                    method: 'POST',
                    body: formData
                });

                // Refresh products list
                await this.fetchProducts();
                return data.value;
            } catch (error: any) {
                this.error = error.message || 'Failed to upload products from Excel';
                console.error('Error uploading products:', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async uploadProductImages(janCode: string, files: File[]) {
            this.loading = true;
            this.error = null;

            try {
                const formData = new FormData();
                formData.append('janCode', janCode);

                files.forEach((file, index) => {
                    formData.append(`images`, file);
                });

                const { data } = await useFetch('/api/admin/images', {
                    method: 'POST',
                    body: formData
                });

                // Refresh products to get updated images
                await this.fetchProducts();
                return data.value;
            } catch (error: any) {
                this.error = error.message || 'Failed to upload product images';
                console.error('Error uploading images:', error);
                return null;
            } finally {
                this.loading = false;
            }
        },

        setFilters(filters: Partial<ProductFilter>) {
            this.filters = { ...this.filters, ...filters };
        },

        clearFilters() {
            this.filters = {
                categories: [],
                brands: [],
                tags: [],
                minPrice: this.priceRange.min,
                maxPrice: this.priceRange.max,
                inStock: false,
                query: ''
            };
        }
    }
});