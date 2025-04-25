//Nav-meny interface
export interface MenuLink {
    href: string;
    pageText: string;
    parent: number;
    id: number;
    children: MenuLink[];
}

export interface PageData {
    slug: string;
    title: { rendered: string };
    parent: number;
    id: number;
}
