export interface EggInfo {
    content: string,
    image: string,
    formatContent: (data: string) => string[],
}
