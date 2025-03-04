export interface EggInfo {
    content: string,
    image: string,
    formatContent: (data: string) => string[],
}

export interface EggItemInfo {
    title: string,
    price: string,
    unitPrice: string,
    image: string,
}