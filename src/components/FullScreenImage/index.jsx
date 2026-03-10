import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Image } from '@tarojs/components'
import './index.scss'

class FullScreenImage extends Component {

  componentDidMount() {
    if (process.env.TARO_ENV === 'h5') {
      // 网页端处理方式
      this.originalStyle = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      // 小程序端处理方式
      Taro.pageScrollTo({ scrollTop: 0 });
    }
  }

  componentWillUnmount() {
    if (process.env.TARO_ENV === 'h5') {
      // 恢复原始样式
      document.body.style.overflow = this.originalStyle;
    }
  }

  handleClick = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    const { imageUrl } = this.props;

    return (
      <View className='full-screen-image' onClick={this.handleClick}>
        <Image
          src={imageUrl}
          mode='aspectFill'
          className='full-screen-image-content'
        />
      </View>
    );
  }
}

export default FullScreenImage;
