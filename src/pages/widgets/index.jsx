import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import TabBar from '../../components/TabBar'
import './index.scss'

export default function Widgets() {
  // 定义小组件数据
  const widgetData = [
    {
      id: 1,
      image: '/assets/widgets/Nft-Artist--Streamline-Brooklyn.png',
      name: 'NFT 艺术家'
    },
    {
      id: 2,
      image: '/assets/widgets/Nft-Limited-Edition--Streamline-Brooklyn.png',
      name: 'NFT 限量版'
    },
    {
      id: 3,
      image: '/assets/widgets/Nft-Marketplace-Opensea--Streamline-Brooklyn.png',
      name: 'NFT 市场'
    },
    {
      id: 4,
      image: '/assets/widgets/About-Our-Team-1--Streamline-Brooklyn.png',
      name: '团队介绍'
    },
    {
      id: 5,
      image: '/assets/widgets/Facetime-Meeting-3--Streamline-Brooklyn.png',
      name: '视频会议'
    },
    {
      id: 6,
      image: '/assets/widgets/Translate-2--Streamline-Brooklyn.png',
      name: '翻译工具'
    }
  ]

  const handleImageClick = (url) => {
    Taro.previewImage({
      urls: [url],
      current: url
    })
  }

  return (
    <View className='widgets-page'>
      <Text className='title'>组件分享</Text>

      <View className='widgets-grid'>
        {widgetData.map(widget => (
          <View key={widget.id} className='widget-item'>
            <Image
              src={widget.image}
              className='widget-image'
              mode='aspectFill'
              onClick={() => handleImageClick(widget.image)}
            />
            <Text className='widget-name'>{widget.name}</Text>
          </View>
        ))}
      </View>

      <View className='widget-description'>
        <Text className='desc-title'>如何使用</Text>
        <View className='desc-content'>
          <Text> 1. 长按下方组件图片保存到手机 </Text>
          <Text>2. 打开快捷指令APP添加小组件</Text>
          <Text>3. 选择照片并添加为桌面组件</Text>
        </View>
      </View>
      {/* <TabBar /> */}
    </View>
  )
}
