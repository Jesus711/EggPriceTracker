import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { EggItemInfo } from '../types'
import StorePrice from './StorePrice'
import { styled } from 'nativewind'


interface StoreListProps {
    index: number,
    name: string,
    scrapedData: EggItemInfo[],
}


const StoreList = ({ index, name, scrapedData }: StoreListProps) => {

    const [isVisible, setIsVisible] = useState(index === 0);
    //console.log(`LOADED: ${name}`, new Date().toTimeString());

    const toggleListButton = () => (
        <TouchableOpacity 
            className={`px-3 py-4 flex-row rounded-xl bg-slate-800`} 
            onPress={() => setIsVisible((prev) => !prev)}>
            <View className='w-full flex-row justify-between'>
                <Text className='font-semibold text-green-400 text-[20px]'>{name} Egg Prices</Text>
                <Text className='font-semibold text-green-400 text-[20px]'>{scrapedData?.length > 0 ? `${scrapedData.length} items` : "No Items Found"}</Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <FlatList
            className={`mb-3 px-2 ${isVisible && scrapedData?.length > 0 ? "h-[300px]" : ""}`}
            data={isVisible ? scrapedData : []}
            renderItem={({ item }) => <StorePrice title={item.title} price={item.price} unitPrice={item.unitPrice} image={item.image}/>}
            ListHeaderComponent={toggleListButton}
            stickyHeaderIndices={[0]}
        />
    )
}

export default styled(StoreList)