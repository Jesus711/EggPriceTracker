const walmartJS = `
    setTimeout(() => {
    // Select all paragraph elements and get their text
    const texts = Array.from(document.querySelectorAll('[data-testid="list-view"]')).slice(1, 6)
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
    }, 5000); // Wait 5 seconds to ensure content loads
`;

const targetJS = `
    setTimeout(() => {
    // Select all paragraph elements and get their text
    const texts = Array.from(document.querySelectorAll('div.styles_ndsCol__MIQSp'))
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
        if (storeInfo.image !== null && storeInfo.content !== null){
            result.push(storeInfo);
        }
    }

    // Send the result array to React Native
    window.ReactNativeWebView.postMessage(JSON.stringify(result));

    // Send data back to React Native
    //window.ReactNativeWebView.postMessage(texts);
    }, 5000); // Wait 5 seconds to ensure content loads
`;


export {
    walmartJS,
    targetJS
}