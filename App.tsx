import React, { RefObject, useRef, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
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
import { EggInfo, EggItemInfo } from './types';
import StoreList from './components/StoreList';


const formatWalmartData = (data: EggInfo[]): EggItemInfo[] => {
  let formatted = []

  for(let i = 0; i < data.length; i++) {

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

const formatTargetData = (data: EggInfo[]): EggItemInfo[] => {
  let formatted = []

  console.log(data[0]?.content.split("\n").slice(0, 5));

  for(let i = 0; i < data.length; i++) {

    let lines = data[i].content.split("\n").slice(0, 5);
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

interface Store {
  name: string,
  url: string,
  format: (data: EggInfo[]) => EggItemInfo[],
  script: string,
}

const stores: Store[] = [
  {
  name: "Walmart", 
  url: "https://www.walmart.com/search?q=eggs&typeahead=eggs",
  format: formatWalmartData,
  script: walmartJS
  }, 
  {name: "Target", 
    url:"https://www.target.com/c/eggs-dairy-grocery/-/N-5xszi",
    format: formatTargetData,
    script: targetJS
  }
];

const App = () => {
  const [scrapedData, setScrapedData] = useState< {[key: string] : EggItemInfo[]}>({});
  const [lastRetrievedDate, setLastRetrievedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean[]>(stores.map(() => true));
  const webViewRefs: RefObject<WebView>[] = useRef(stores.map(() => React.createRef<WebView>())).current;
  const isAllLoaded: boolean = !isLoading.some((loading) => loading);

  const handleLoadEnd = (index: number) => {
    setIsLoading((prev) => {
      const newStates = [...prev]
      newStates[index] = false;
      return newStates
    })
  }

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // Handle messages from WebView
  const handleMessage = (index: number, storeName: string, event: WebViewMessageEvent, handleData: (data: EggInfo[]) => EggItemInfo[]) => {
    if(!isLoading[index]){
      return
    }
    let currentTime: string = new Date().toDateString();
    console.log(event.nativeEvent.data, currentTime)

    let formattedData = handleData(JSON.parse(event.nativeEvent.data))
    let newData = {...scrapedData, [storeName]: formattedData};
    setScrapedData(newData); // Update state with scraped data

    setLastRetrievedDate(currentTime)
    console.log(storeName, "DONE", new Date().toTimeString())
    handleLoadEnd(index);
  };

  return (
    <SafeAreaView className='flex-1' style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      {/* App Title */}
      <View className='pt-4 flex justify-center items-center flex-row'>
        <Image 
          source={Images.icon}
          className='w-[40px] h-[40px] rounded-xl mr-4'
        />
        <Text className='text-green-300 text-[28px] font-bold items-center'>Egg Price Tracker</Text>
      </View>

      {/* Reload Prices Button */}
      <View className='px-12 py-3'>
        <TouchableOpacity className='bg-green-400 py-2 flex flex-row justify-center rounded-xl' onPress={() => {
          setScrapedData({});
          console.log("Reloading...");
          for(let i = 0; i < stores.length; i++){
            webViewRefs[i].current?.reload();
          }
          setIsLoading(stores.map(() => (true)))
          }}>
          <Text className='text-[20px] text-gray-800 font-semibold'>Reload All Prices</Text>
        </TouchableOpacity>
        {lastRetrievedDate && <Text className='text-[16px] mt-1 text-green-400 font-semibold text-center'>Last Retrieved: {lastRetrievedDate}</Text>}
      </View>

      {!isAllLoaded && (
        <View className='flex-1'>
          <Text className='text-center text-[36px] text-green-300 mb-4'>Stores Remaining:</Text>
          {stores.map((store, index) => {
            return (
              <View key={index} className={`flex-1 p-4 ${!isLoading[index] ? "hidden": ""}`}>
                <Text className='text-center text-[24px] text-green-300'>Retrieving {store.name} Prices...</Text>
                <WebView
                  className='h-[25px]'
                  ref={webViewRefs[index]}
                  source={{ uri: store.url }} // Change to your target website
                  //onLoadEnd={() => webViewRefs[index].current?.injectJavaScript(store.script)}
                  injectedJavaScript={store.script}
                  onMessage={(e) => handleMessage(index, store.name, e, store.format)} // Receive messages from WebView
                />
              </View>
            )
      })}
        </View>
    )}

      {isAllLoaded && stores.map((store, index) => (
        <StoreList key={store.name} index={index} name={store.name} scrapedData={scrapedData[store.name]} />
      ))}

    </SafeAreaView>
  );
};


export default App;
