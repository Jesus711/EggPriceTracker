export interface StorePageInfo {
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

export interface Store {
    name: string,
    url: string,
    format: (data: StorePageInfo[]) => EggItemInfo[],
    script: string,
  }