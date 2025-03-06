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
    }, 3000); // Wait 3 seconds to ensure content loads
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
    }, 7000); // Wait 15 seconds to ensure content loads
`;

const zipcode = 91766

const costcoJS = `
setTimeout(() => {
    const zipCodeAdded = document.querySelector('span#bdzip');

    if (!zipCodeAdded) {

        // Click on Set Delivery Zip Code
        const setZip = document.querySelector('[automation-id="changeDeliveryZipCodeLink"]')
        setZip.click()

        // Step 2: Click an input element
        const zipcode = document.querySelector('div#popover374217').querySelector('input[type="text"]');
        zipcode.click();

        // Step 3: Type in "12345"
        zipcode.value = ${ zipcode };

        // Step 4: Click on an input type submit element
        zipcode.querySelector('input[type="submit"]').click();

        window.scrollTo(0, document.body.scrollHeight);

        setTimeout(() => {
            const texts = Array.from(document.querySelectorAll('div.product'))

            const result = []

            for (let i = 0; i < texts.length; i++) {
                let storeInfo = {};

                // Extract image src (if image exists)
                let image = texts[i].querySelector("img");
                storeInfo.image = image ? image.src : null; // Check if image exists before accessing src

                // Extract the content from the span
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
        }, 2000);

    } else {
        setTimeout(() => {
            const texts = Array.from(document.querySelectorAll('div.product'))

            const result = []

            for (let i = 0; i < texts.length; i++) {
                let storeInfo = {};

                // Extract image src (if image exists)
                let image = texts[i].querySelector("img");
                storeInfo.image = image ? image.src : null; // Check if image exists before accessing src

                // Extract the content from the span
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
        }, 1000);
    }

}, 3000); // Wait 3 seconds to ensure content loads
`

export {
    walmartJS,
    targetJS,
    costcoJS
}