const walmartJS = `
    window.IntersectionObserver = class {
        constructor(callback) { this.callback = callback; }
        observe() { this.callback([{ isIntersecting: true }], this); }
        unobserve() {}
        disconnect() {}
    };
    window.scrollTo(0, document.body.scrollHeight/2);
    setTimeout(() => {
    // Select all paragraph elements and get their text
    const texts = Array.from(document.querySelectorAll('[data-testid="list-view"]')).slice(1, 5)
    //.map(el => el.innerText)
    //.join("\\n\\n"); // Join paragraphs with line breaks

    const result = []

    // Loop over your text elements (assuming texts contains the div elements)
    for (let i = 0; i < texts.length; i++) {
        let storeInfo = {};

        // Extract image src (if image exists)
        let image = texts[i].querySelector("img");
        storeInfo.image = image ? image.src : null; // Check if image exists before accessing src

        // Extract the content from the span
        let content = texts[i].querySelector("div");
        storeInfo.content = content ? content.innerText : null; // Ensure span exists

        // Push the result to the array
        result.push(storeInfo);
    }

    // Send the result array to React Native
    window.ReactNativeWebView.postMessage(JSON.stringify(result));

    // Send data back to React Native
    //window.ReactNativeWebView.postMessage(result);
    }, 3000); // Wait 5 seconds to ensure content loads
`;

const targetJS = `
    window.scrollTo(0, document.body.scrollHeight/3);
    setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight/5);
    }, 2000)

    setTimeout(() => {
    // Select all paragraph elements and get their text
    const texts = Array.from(document.querySelectorAll('div.styles_ndsCol__MIQSp'))//.slice(0, 6)

    const result = []

    // Loop over your text elements (assuming texts contains the div elements)
    for (let i = 0; i < texts.length; i++) {
        let storeInfo = {};

        // Extract image src (if image exists)
        let image = texts[i].querySelector("img");
        storeInfo.image = image ? image.src : null; // Check if image exists before accessing src

        // Extract the content from the span
        let content = texts[i].querySelector("div");
        storeInfo.content = content ? content.innerText : null; // Ensure span exists

        // Push the result to the array
        if (storeInfo.image !== null && storeInfo.content !== null){
            if (storeInfo.content.includes("Eggs")){
                result.push(storeInfo);
            }
        }
    }

    // Send the result array to React Native
    window.ReactNativeWebView.postMessage(JSON.stringify(result));
    }, 10000); // Wait 8 seconds to ensure content loads
`;


export {
    walmartJS,
    targetJS
}