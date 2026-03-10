import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

export default function WallpaperItem({ item, onFullScreen }) {
  // 点击壁纸时，触发全屏显示
  const handleClick = () => {
    if (typeof onFullScreen === 'function' && item && item.imageUrl) {
      onFullScreen(item.imageUrl);
    }
  };

  return (
    <View className='wallpaper-item' onClick={handleClick}>
      <Image
        src={item.thumbnailUrl}
        mode='aspectFill'
        className='wallpaper-image'
        showMenuByLongpress
      />
    </View>
  )
}