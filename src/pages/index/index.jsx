import { View } from '@tarojs/components'
import { useEffect } from 'react'
import Taro from '@tarojs/taro'

import WallpaperGrid from '../../components/WallpaperGrid'
import TabBar from '../../components/TabBar'
import './index.scss'

export default function Index() {
  // 处理触摸开始事件
  const handleTouchStart = (e) => {
    // 如果触摸点在页面顶部附近，阻止默认行为
    const touch = e.touches[0]
    if (touch && touch.pageY < 10) {
      e.stopPropagation()
      return false
    }
  }

  // 处理触摸移动事件
  const handleTouchMove = (e) => {
    // 如果是向下拖动，阻止默认行为
    const touch = e.touches[0]
    if (touch && touch.pageY < 10) {
      e.stopPropagation()
      return false
    }
  }

  return (
    <View 
      className='index-page'
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <WallpaperGrid title="精选壁纸" />
      {/* <TabBar /> */}
    </View>
  )
}