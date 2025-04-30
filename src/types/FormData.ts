export interface FormData {
    name: string;
    email: string;
    message: string;
    phone: string;
    checkbox: boolean;
}

export interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
    phone?: string;
    checkboxMsg?: string;

}


