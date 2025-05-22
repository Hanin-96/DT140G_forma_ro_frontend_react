import { makeAutoObservable, runInAction } from "mobx";
import { PostType } from "../types/PostType";

class PostStore {


    posts: any[] = [];
    post: PostType | null = null;
    loading: boolean = false;
    error: string = "";



    constructor() {
        makeAutoObservable(this);
    }

    async getAllPosts(categoryId: number) {

        runInAction(() => {
            this.loading = true;
            this.error = "";
        });


        try {
            const response = await fetch(`http://localhost:8002/wp-json/forma_ro/v2/posts?category=${categoryId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("postdata: ", data);
                runInAction(() => {
                    this.posts = data;
                    this.loading = false;
                });
            }
        } catch (error) {
            runInAction(() => {
                this.error = "Kunde inte hämta post inläggen.";
                this.loading = false;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }

    }

    //Hämta specifik post från Id
    async getPostById(postId: string) {
        runInAction(() => {
            this.loading = true;
            this.error = "";
            this.post = null;
        });

        try {
            const response = await fetch(`http://localhost:8002/wp-json/forma_ro/v2/posts/${postId}`);

            if (response.ok) {
                const data = await response.json();
                console.log("post: ", data[0])
                runInAction(() => {
                    this.post = data[0];
                    this.loading = false;
                });
            }

        } catch (error) {
            runInAction(() => {
                this.error = "Kunde inte hämta post inläggen.";
                this.loading = false;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }

    }
}

export const postStore = new PostStore();