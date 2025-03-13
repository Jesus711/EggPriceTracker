import { View, Text, TouchableOpacity } from 'react-native'
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

    return (
        <View className='p-2'>
            <TouchableOpacity 
                className={`border-2 border-slate-600 px-3 py-4 flex-row rounded-xl bg-slate-800 ${isVisible && "bg-green-400"}`} 
                onPress={() => setIsVisible((prev) => !prev)}>
                <View className='w-full flex-row justify-between'>
                    <Text className={`font-semibold ${isVisible ? "text-slate-800": "text-green-400"} text-[20px]`}>{name} Egg Prices</Text>
                    <Text className={`font-semibold ${isVisible ? "text-slate-800": "text-green-400"} text-[20px]`}>{scrapedData?.length > 0 ? `${scrapedData.length} items` : "No Items Found"}</Text>
                </View>
            </TouchableOpacity>
            {isVisible && scrapedData?.map((item, index) => {
                console.log(name, item, index)
                return(
                <StorePrice key={index} title={item.title} price={item.price} unitPrice={item.unitPrice} image={item.image}/>
            )})}
            {isVisible && <TouchableOpacity 
                className={`mx-10 mt-2 mb-3 py-3 rounded-xl bg-red-400`} 
                onPress={() => setIsVisible((prev) => !prev)}
            >   
                <Text className={`font-bold text-black text-[20px] text-center`}>Close {name} Prices</Text>
            </TouchableOpacity>}

            {isVisible && <View className='mx-6 mb-3 border-b-gray-400 border-b-4' />}

        </View>
    )
}

export default styled(StoreList)