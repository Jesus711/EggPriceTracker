import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { WebView, WebViewMessageEvent } from "react-native-webview";
import { Images } from './images/images';


interface EggInfo {
  content: string,
  image: string
}


const StorePrice = ({content, image}: EggInfo) => {

  let lines = content.split("\n").slice(1, 4);
  let price = lines[0].split(" ").slice(-1)
  let unitPrice = lines[1]
  let itemName = lines[2]


  return (
    <View className='bg-gray-700 px-4 py-2 rounded-xl mb-4'>
      <Text className='text-[18px] text-white'>{itemName}</Text>
      <View className='flex-row justify-between items-center pt-2'>
        <View>
          <Text className='text-[18px] text-white'>Price: {price}</Text>
          <Text className='text-[18px] text-white'>Per Unit: {unitPrice}</Text>
        </View>
        <Image 
          source={{ uri: image}}
          className='h-[64px] w-[64px] rounded-md'
        />
      </View>
    </View>
  )
}


const App = () => {

  const webViewRef = useRef<WebView>(null);
  const [scrapedData, setScrapedData] = useState<EggInfo[]>([]);
  const [lastRetrievedDate, setLastRetrievedDate] = useState<string>("");

  const stores: String[] = ["https://www.walmart.com/search?q=eggs&typeahead=eggs"];

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const injectedJS = `
    setTimeout(() => {
      // Select all paragraph elements and get their text
      const texts = Array.from(document.querySelectorAll('[data-testid="list-view"]')).slice(1, 3)
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
    }, 2000); // Wait 2 seconds to ensure content loads
  `;

  // Handle messages from WebView
  const handleMessage = (event: WebViewMessageEvent) => {
  
    let currentTime: string = new Date().toDateString();
    console.log(event.nativeEvent.data, currentTime)
    setLastRetrievedDate(currentTime)
    setScrapedData(JSON.parse(event.nativeEvent.data)); // Update state with scraped data
  };

  return (
    <SafeAreaView className='flex-1' style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View className='pt-4 flex justify-center items-center flex-row'>
        <Image 
          source={Images.icon}
          className='w-[40px] h-[40px] rounded-xl mr-4'
        />
        <Text className='text-green-300 text-[32px] font-bold items-center'>Egg Prices</Text>
      </View>

      {/* <View
        className='flex flex-row justify-center'
        >
        <TextInput 
          placeholder='Enter your zipcode to find local prices' 
          placeholderTextColor={"lightgray"} 
        />
      </View> */}

      <View className='px-8 py-3'>
        <TouchableOpacity className='bg-green-400 py-3 flex flex-row justify-center rounded-xl' onPress={() => {
          setScrapedData([]);
          console.log("Reloading...");
          webViewRef.current?.reload();
          }}>
          <Text className='text-[18px] text-gray-800 font-semibold'>Reload Prices</Text>
        </TouchableOpacity>
        {lastRetrievedDate && <Text className='text-[16px] text-green-400 font-semibold'>Last Retrieved: {lastRetrievedDate}</Text>}
      </View>


      {scrapedData.length == 0 && (
        <View className='flex-1 bg-black'>
          <WebView
            className='flex-1'
            ref={webViewRef}
            source={{ uri: "https://www.walmart.com/search?q=eggs&typeahead=eggs" }} // Change to your target website
            injectedJavaScript={injectedJS}
            onMessage={handleMessage} // Receive messages from WebView
          />
          </View>
      )}


      {scrapedData.length > 0 && <FlatList
        className='p-4'
        data={scrapedData}
        renderItem={({item}) => <StorePrice content={item.content} image={item.image} />}
        ListHeaderComponent={scrapedData.length > 0 && <Text className='mb-3 font-semibold text-green-400 text-[20px]'>Walmart Egg Prices</Text>}
        //ListEmptyComponent={<View><Text>No Prices Found</Text></View>}
      />}

    </SafeAreaView>
  );
};


export default App;
