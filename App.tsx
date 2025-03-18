import React, { RefObject, useEffect, useRef, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { WebView, WebViewMessageEvent, WebViewNavigation } from "react-native-webview";
import { Images } from './images/images';
import { StorePageInfo, EggItemInfo } from './types';
import StoreList from './components/StoreList';
import { stores } from './constants';


const App = () => {
  const [scrapedData, setScrapedData] = useState< {[key: string] : EggItemInfo[]}>({});
  const [lastRetrievedDate, setLastRetrievedDate] = useState<string>("");
  const [loadingStates, setloadingStates] = useState<boolean[]>(stores.map(() => true));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [locatedPrevPrices, setLocatedPrevPrices] = useState<boolean>(true);
  const webViewRefs: RefObject<WebView>[] = useRef(stores.map(() => React.createRef<WebView>())).current;
  const isAllLoaded: boolean = !loadingStates.some((loading) => loading);

  const backgroundStyle = {
    backgroundColor: Colors.darker
  };

  const handleLoadEnd = (index: number) => {
    setloadingStates((prev) => {
      const newStates = [...prev]
      newStates[index] = false;
      return newStates
    })
  }

  const handleNavigationStateChange = (index: number, navState: WebViewNavigation) => {
    const { url, loading } = navState;
    console.log('Nav state:', { url, loading });

    // Check if page has finished loading
    if (!loading) {
      webViewRefs[index].current?.injectJavaScript(stores[index].script);
    }
  };

  const storeUpdatedPrices = async () => {
    let dataToStore = {
      date: lastRetrievedDate,
      egg_prices: scrapedData
    }
    AsyncStorage.setItem("egg_prices", JSON.stringify(dataToStore))
    console.log("Stored Updated Prices")
  }

  const handlePricesReload = () => {
    setScrapedData({});
    setLocatedPrevPrices(false);
    setLastRetrievedDate("");
    console.log("Reloading...");
    setloadingStates(stores.map(() => (true)))
  }

  // Handle messages from WebView
  const handleMessage = (index: number, storeName: string, event: WebViewMessageEvent, handleData: (data: StorePageInfo[]) => EggItemInfo[]) => {
    let currentTime: string = new Date().toDateString();
    let formattedData = handleData(JSON.parse(event.nativeEvent.data))
    let newData = {...scrapedData, [storeName]: formattedData};
    setScrapedData(newData);
    setLastRetrievedDate(currentTime)
    handleLoadEnd(index);
  };

  const handleConsole = (event: WebViewMessageEvent) => {
    console.log('WebView message:', JSON.parse(event.nativeEvent.data));
  }


  if(isAllLoaded){
    storeUpdatedPrices()
  }

  useEffect(() => {

    const loadPrices = async () => {  

      let last_prices = await AsyncStorage.getItem("egg_prices")

      if (last_prices !== null) {
        let data: {date: string, egg_prices: {[key: string] : EggItemInfo[]}} = JSON.parse(last_prices)
        let lastRetrievedDate: string = data.date
        let egg_prices: {[key: string] : EggItemInfo[]} = data.egg_prices
        console.log("Retrieved last Prices")

        if (egg_prices === undefined){
          setLocatedPrevPrices(false)
          return
        }
        setLastRetrievedDate(lastRetrievedDate)
        setScrapedData(egg_prices)
        setLocatedPrevPrices(true);
        return;
      }
      setLocatedPrevPrices(false)
    }
    loadPrices()
    setIsLoading(false)
  }, [])

  return (
    <SafeAreaView className='flex-1' style={backgroundStyle}>
      <StatusBar
        barStyle={'light-content'}
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
        <TouchableOpacity className='bg-green-400 py-2 flex flex-row justify-center rounded-xl' onPress={handlePricesReload}>
          <Text className='text-[20px] text-gray-800 font-semibold'>Reload All Prices</Text>
        </TouchableOpacity>
        {lastRetrievedDate && <Text className='text-[16px] mt-1 text-green-400 font-semibold text-center'>Last Retrieved: {lastRetrievedDate}</Text>}
      </View>

      {!isLoading && !locatedPrevPrices && !isAllLoaded && (
        <ScrollView className='flex-1' nestedScrollEnabled>
          <Text className='text-center text-[36px] text-green-300 mb-4'>Stores Remaining:</Text>
          {stores.map((store, index) => {
            return (
              <View key={index} className={`p-4 ${!loadingStates[index] ? "hidden": ""}`}> 
                <Text className='text-center text-[24px] text-green-300'>Retrieving {store.name} Prices...</Text>
                <WebView
                  className='w-full h-[480px]'
                  ref={webViewRefs[index]}
                  source={{ uri: store.url }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  geolocationEnabled={true}
                  onNavigationStateChange={(navState) => handleNavigationStateChange(index, navState)}
                  onMessage={(e) => handleMessage(index, store.name, e, store.format)}
                  //onMessage={(e) => handleConsole(e)}
                />
              </View>
            )
      })}
        </ScrollView>
    )}

      {/* Shows loading text when trying to retrieve presious stored prices */}
      {isLoading && (<View className='flex-1 justify-center items-center'>
        <Text className='text-green-400 text-[32px] font-bold text-center'>Loading...</Text>
      </View>)
      }

      {/* Is displayed after retrieve from async storage is finished and (prices were retrieved or Reload all prices is completed) */}
      {!isLoading && (locatedPrevPrices || isAllLoaded) &&
        <ScrollView>
          <View className='mb-4'><Text className='text-green-400 text-center text-[24px] font-bold'>Tap a Store and Scroll!</Text></View>
          {stores.map((store, index) => (
            <StoreList key={store?.name + index} index={index} name={store.name} scrapedData={scrapedData[store.name]} />
          ))}
        </ScrollView>
      }

    </SafeAreaView>
  );
};


export default App;
