import { walmartJS, targetJS, costcoJS } from "./scripts"
import { StorePageInfo, Store, EggItemInfo } from "./types"

const formatWalmartData = (data: StorePageInfo[]): EggItemInfo[] => {
    let formatted = []

    for (let i = 0; i < data.length; i++) {

        let lines = data[i].content.split("\n").slice(1, 4);
        let price: string = lines[0].split(" ").slice(-1)[0]
        let unitPrice: string = lines[1]
        let itemName: string = lines[2]

        let item: EggItemInfo = {
            title: itemName,
            price,
            unitPrice,
            image: data[i].image
        }

        formatted.push(item);
    }
    return formatted
}

const formatTargetData = (data: StorePageInfo[]): EggItemInfo[] => {
    let formatted = []

    console.log(data[0]?.content.split("\n").slice(0, 5));

    for (let i = 0; i < data.length; i++) {

        let lines = data[i].content.split("\n").slice(0, 5);
        let price: string = lines[0]
        let unitPrice: string = lines[0]
        let itemName: string = lines[1]

        if (lines[0].includes("rated")) {
            let cost_data = lines[1].split("(")
            price = cost_data[0]
            unitPrice = cost_data[1].replace(")", "")
            itemName = lines[2]
        }
        else {
            let cost_data = lines[0].split("(")
            price = cost_data[0]
            unitPrice = cost_data[1]?.replace(")", "")
            itemName = lines[1]
        }

        let item: EggItemInfo = {
            title: itemName,
            price,
            unitPrice,
            image: data[i].image
        }

        formatted.push(item);
    }
    return formatted
}

export const stores: Store[] = [
    {
        name: "Walmart",
        url: "https://www.walmart.com/search?q=eggs&typeahead=eggs",
        format: formatWalmartData,
        script: walmartJS
    },
    {
        name: "Target",
        url: "https://www.target.com/c/eggs-dairy-grocery/-/N-5xszi",
        format: formatTargetData,
        script: targetJS
    }
];
