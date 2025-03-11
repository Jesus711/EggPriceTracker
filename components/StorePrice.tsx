import { View, Text, Image } from 'react-native'
import React from 'react'
import { EggItemInfo } from '../types';
import { styled } from 'nativewind';

const StorePrice = ({title, price, unitPrice, image}: EggItemInfo) => {

  return (
    <View className='bg-gray-700 px-4 py-2 m-2 rounded-xl'>
      <Text className='text-[20px] text-white '>{title}</Text>
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
export default styled(StorePrice)