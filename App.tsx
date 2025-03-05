import React, { RefObject, useEffect, useRef, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { WebView, WebViewMessageEvent } from "react-native-webview";
import { Images } from './images/images';
import { StorePageInfo, EggItemInfo } from './types';
import StoreList from './components/StoreList';
import { stores } from './constants';


const App = () => {
  const [scrapedData, setScrapedData] = useState< {[key: string] : EggItemInfo[]}>({});
  const [lastRetrievedDate, setLastRetrievedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean[]>(stores.map(() => true));
  const [locatedPrevPrices, setLocatedPrevPrices] = useState<boolean>(false);
  const webViewRefs: RefObject<WebView>[] = useRef(stores.map(() => React.createRef<WebView>())).current;
  const isAllLoaded: boolean = !isLoading.some((loading) => loading);
  
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleLoadEnd = (index: number) => {
    setIsLoading((prev) => {
      const newStates = [...prev]
      newStates[index] = false;
      return newStates
    })
  }


  const storeUpdatedPrices = async () => {
    let dataToStore = {
      date: lastRetrievedDate,
      egg_prices: scrapedData
    }
    AsyncStorage.setItem("egg_prices", JSON.stringify(dataToStore))
    console.log("Stored Updated Prices")
  }

  // Handle messages from WebView
  const handleMessage = (index: number, storeName: string, event: WebViewMessageEvent, handleData: (data: StorePageInfo[]) => EggItemInfo[]) => {
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

  if(isAllLoaded){
    storeUpdatedPrices()
  }
  useEffect(() => {

    const loadPrices = async () => {
      let last_prices = await AsyncStorage.getItem("egg_prices")
      if (last_prices !== null) {
        let data = JSON.parse(last_prices)
        let lastRetrievedDate = data.date
        setLastRetrievedDate(lastRetrievedDate)
        setScrapedData(data.egg_prices)
        console.log("Retrieved last Prices")
        setLocatedPrevPrices(true)
      }
    }
    loadPrices()
  }, [])

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
          setLocatedPrevPrices(false)
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

      {!locatedPrevPrices && !isAllLoaded && (
        <View className='flex-1'>
          <Text className='text-center text-[36px] text-green-300 mb-4'>Stores Remaining:</Text>
          {stores.map((store, index) => {
            return (
              <View key={index} className={`flex-1 p-4 ${!isLoading[index] ? "hidden": ""}`}>
                <Text className='text-center text-[24px] text-green-300'>Retrieving {store.name} Prices...</Text>
                <WebView
                  className=''
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

      {(locatedPrevPrices || isAllLoaded) && stores.map((store, index) => (
        <StoreList key={store.name} index={index} name={store.name} scrapedData={scrapedData[store.name]} />
      ))}

    </SafeAreaView>
  );
};


export default App;
