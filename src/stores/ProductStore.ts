import { makeAutoObservable, runInAction } from "mobx";
import { ProductData } from "../types/Product";

class ProductStore {
    products: any[] = [];
    productCategories: string[] = [];
    loading: boolean = false;
    error: string = "";
    currentPage = 1;
    productsPerPage = 9;
    product: ProductData | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    //Hämtar alla keramik produkter
    async getCeramicProducts() {
        if (this.products.length > 0) return;

        this.loading = true;
        this.error = "";

        try {
            const response = await fetch(
                "http://localhost:8002/wp-json/wp/v2/product?_fields=title,product_price,product_description,product_thumbnail,id,date,product_category",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();

                const sortedData = data.sort(
                    (a: { date: string }, b: { date: string }) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                const uniqueCategories = this.extractCategories(sortedData);

                runInAction(() => {
                    this.products = sortedData;
                    this.productCategories = uniqueCategories;
                    this.loading = false;
                });
            }
        } catch (error) {
            runInAction(() => {
                this.error = "Kunde inte hämta produkter.";
                this.loading = false;
            });
        } finally {
            this.loading = false;
        }
    }

    async getProductById(productId: string) {

        this.loading = true;
        this.error = "";
        this.product = null;

        try {
            const response = await fetch(`http://localhost:8002/wp-json/wp/v2/product/${productId}`);

            if (response.ok) {
                const data = await response.json();
                runInAction(() => {
                    this.product = data;
                    console.log(data);
                    this.loading = false;
                });
            }
        } catch (error) {
            runInAction(() => {
                this.error = "Kunde inte hämta produkten.";
                this.loading = false;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    //Extraherar unika kategorier
    extractCategories(products: any[]): string[] {
        const list = products.flatMap((p) =>
            p.product_category?.map((c: any) => c.name) || []
        );
        return [...new Set(list)];
    }

    get UniqueCategories(): string[] {
        return this.extractCategories(this.products);
    }

    //Paginering
    get paginatedProducts() {
        const indexOfLastProduct = this.currentPage * this.productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - this.productsPerPage;
        return this.products.slice(indexOfFirstProduct, indexOfLastProduct);
    }

    setPage(page: number) {
        this.currentPage = page;
    }

    /*
    findProductById(id: number | null) {
        return this.products.find((p) => p.id == id);
    }
        */
}


export const productStore = new ProductStore();
