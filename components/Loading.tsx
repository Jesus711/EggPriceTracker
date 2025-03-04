import { View, Text } from 'react-native'
import React from 'react'

interface LoadingProps {
    storeName: string
}

const Loading = ({storeName}: LoadingProps) => {
  return (
    <View>
      <Text>Loading {storeName}'s Prices</Text>
    </View>
  )
}

export default Loading