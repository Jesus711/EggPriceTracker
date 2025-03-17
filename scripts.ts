const walmartJS = `
    window.IntersectionObserver = class {
        constructor(callback) { this.callback = callback; }
        observe() { this.callback([{ isIntersecting: true }], this); }
        unobserve() {}
        disconnect() {}
    };
    window.scrollTo(0, document.body.scrollHeight/2);

    setTimeout(() => {

    // Select 10 products displayed
    const texts = Array.from(document.querySelectorAll('[data-testid="list-view"]')).slice(0, 10)


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

        if (storeInfo.image !== null && storeInfo.content !== null){
            if (storeInfo.content.includes("Eggs")){
                result.push(storeInfo);
            }
        }
    }

    // Send the result array to React Native
    window.ReactNativeWebView.postMessage(JSON.stringify(result));
    }, 4000); // Wait 4 seconds to ensure content loads
`;

const targetJS = `
    // Scroll through document page
    (function() {
        const totalHeight = document.body.scrollHeight;
        const viewportHeight = window.innerHeight;
        const maxScroll = totalHeight - viewportHeight; // Max scrollable distance
        const scrollStep = 5; // Pixels per step (adjust for smoothness)
        const scrollInterval = 2; // Milliseconds between steps (adjust for speed)
        let currentScroll = 0;

        function smoothScroll() {
            if (currentScroll < maxScroll) {
                currentScroll += scrollStep;
                window.scrollTo(0, currentScroll);
                setTimeout(smoothScroll, scrollInterval);
            }
        }

        // Start scrolling
        smoothScroll();
    })();

    setTimeout(() => {

        // Get all products
        const texts = Array.from(document.querySelectorAll('div.sc-4fd1fd45-0'))

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
    }, 10000); // Wait 10 seconds to ensure content loads
`;

const costcoJS = `
    setTimeout(() => {
        // Get all Products
        const texts = Array.from(document.querySelectorAll('div.product'))

        const result = []

        for (let i = 0; i < texts.length; i++) {
            let storeInfo = {};

            // Extract image src (if image exists)
            let image = texts[i].querySelector("img");
            storeInfo.image = image ? image.src : null; // Check if image exists before accessing src

            // Extract the content from the span        
            window.scrollTo(0, document.body.scrollHeight / 2);

            let content = texts[i].querySelector("div.caption");
            storeInfo.content = content ? content.innerText : null; // Ensure span exists

            // Push the result to the array
            if(storeInfo.content){
                if (storeInfo.content.includes("Dozen") || storeInfo.content.includes("ct"))
                    result.push(storeInfo);
            }
        }

        // Send the result array to React Native
        window.ReactNativeWebView.postMessage(JSON.stringify(result));

    }, 4000); // Wait 4 seconds to ensure content loads
`

export {
    walmartJS,
    targetJS,
    costcoJS
}