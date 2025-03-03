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
import { walmartJS, targetJS } from './scripts';
import { EggInfo } from './types';



const handleWalmartData = (data: string): string[] => {

  let lines = data.split("\n").slice(1, 4);
  let price: string = lines[0].split(" ").slice(-1)[0]
  let unitPrice: string = lines[1]
  let itemName: string = lines[2]

  return [price, unitPrice, itemName]
}

const handleTargetData = (data: string): string[] => {

  let lines = data.split("\n").slice(0, 5);
  let price: string = lines[0]
  let unitPrice: string = lines[0]
  let itemName: string = lines[1]

  if (lines[0].includes("rated")){
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
  return [price, unitPrice, itemName]
}

const handleCostcoData = (data: string): string[] => {


  
  return []
}

const StorePrice = ({content, image, formatContent}: EggInfo) => {

  let data = formatContent(content);
  let price = data[0]
  let unitPrice = data[1]
  let itemName = data[2]

  return (
    <View className='bg-gray-700 px-4 py-2 rounded-xl mb-4'>
      <Text className='text-[20px] text-white'>{itemName}</Text>
      <View className='flex-row justify-between items-center pt-2'>
        <View>
          <Text className='text-[18px] text-white'>Price: {price}</Text>
          <Text className='text-[18px] text-white'>Per Unit: {unitPrice}</Text>
        </View>
        {image && <Image 
          source={{ uri: image}}
          className='h-[64px] w-[64px] rounded-md'
        />}
      </View>
    </View>
  )
}


const App = () => {

  const webViewRef = useRef<WebView>(null);
  const [scrapedData, setScrapedData] = useState< {[key: string] : EggInfo[]}>({});
  const [lastRetrievedDate, setLastRetrievedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const stores: String[] = ["https://www.walmart.com/search?q=eggs&typeahead=eggs", "https://www.target.com/c/eggs-dairy-grocery/-/N-5xszi"];

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // Handle messages from WebView
  const handleMessage = (storeName: string, event: WebViewMessageEvent) => {
    let currentTime: string = new Date().toDateString();
    console.log(event.nativeEvent.data, currentTime)
    setLastRetrievedDate(currentTime)
    setScrapedData({...scrapedData, [storeName]: JSON.parse(event.nativeEvent.data)}); // Update state with scraped data
    if(storeName === "Target"){
      setIsLoading(false)
    }
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
        <Text className='text-green-300 text-[28px] font-bold items-center'>Egg Price Tracker</Text>
      </View>

      <View className='px-12 py-3'>
        <TouchableOpacity className='bg-green-400 py-2 flex flex-row justify-center rounded-xl' onPress={() => {
          setScrapedData({});
          console.log("Reloading...");
          setIsLoading(true)
          webViewRef.current?.reload();
          }}>
          <Text className='text-[20px] text-gray-800 font-semibold'>Reload Prices</Text>
        </TouchableOpacity>
        {lastRetrievedDate && <Text className='text-[16px] mt-1 text-green-400 font-semibold text-center'>Last Retrieved: {lastRetrievedDate}</Text>}
      </View>


      {scrapedData["Walmart"] === undefined && (
        <View className='flex-1 bg-black'>
          <Text className='text-center'>Loading Walmart...</Text>
          <WebView
            className='flex-1'
            ref={webViewRef}
            source={{ uri: "https://www.walmart.com/search?q=eggs&typeahead=eggs" }} // Change to your target website
            injectedJavaScript={walmartJS}
            onMessage={(e) => handleMessage("Walmart", e)} // Receive messages from WebView
          />
          </View>
      )}

        {scrapedData["Target"] === undefined && <View className='flex-1 bg-black'>
          <Text className='text-center'>Loading Target...</Text>
          <WebView
            className='flex-1'
            ref={webViewRef}
            source={{ uri: "https://www.target.com/c/eggs-dairy-grocery/-/N-5xszi" }} // Change to your target website
            injectedJavaScript={targetJS}
            onMessage={(e) => handleMessage("Target", e)} // Receive messages from WebView
          />
        </View>}



      {/* Walmart */}
      {!isLoading && 
        <FlatList
          className='h-[200px] mb-3 px-2'
          data={scrapedData["Walmart"]}
          renderItem={({item}) => <StorePrice content={item.content} image={item.image} formatContent={handleWalmartData} />}
          ListHeaderComponent={<View className={`px-3 py-2 flex-row items-center`} style={{backgroundColor: backgroundStyle.backgroundColor}}><Text className='mb-3 font-semibold text-green-400 text-[20px]'>Walmart Egg Prices</Text></View>}
          stickyHeaderIndices={[0]}
        />
      }

      {/* Target */}
      {!isLoading &&
        <FlatList
          className='h-[200px] px-2'
          data={scrapedData["Target"]}
          renderItem={({item}) => <StorePrice content={item.content} image={item.image} formatContent={handleTargetData} />}
          ListHeaderComponent={<View className={`px-3 py-2 flex-row items-center`} style={{backgroundColor: backgroundStyle.backgroundColor}}><Text className='mb-3 font-semibold text-green-400 text-[20px]'>Target Egg Prices</Text></View>}
          stickyHeaderIndices={[0]}
        />
      }

    </SafeAreaView>
  );
};


export default App;
