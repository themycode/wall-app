import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import TabBar from '../../components/TabBar'
import './index.scss'

export default function About() {
  const contactMe = () => {
    Taro.showModal({
      title: '联系我们',
      content: '邮箱：contact@example.com\n微信：wallpaper-service'
    })
  }

  return (
    <View className="about-page">
      {/* <Text className="page-title">关于我们</Text> */}
      <View className="header">
        {/* <Image
          src="https://example.com/app-icon.jpg"
          className="app-icon"
        /> */}
        <Text className="app-name">壁纸精选</Text>
        <Text className="app-version">v1.0.0</Text>
      </View>

      <View className="app-description">
        <Text className="description-text">
          每日精选高清壁纸，为您提供最优质的美学体验。
          精选世界各地摄影师的优秀作品，每一张壁纸都经过精心挑选。
          每日更新，让您的设备始终焕发新意。
        </Text>
      </View>

      <Button
        className="contact-button"
        onClick={contactMe}
      >
        联系开发者
      </Button>

      <View className="copyright">
        © 2023 壁纸精选. All Rights Reserved.
      </View>
      {/* <TabBar /> */}
    </View>
  )
}
