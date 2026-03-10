
import Taro from '@tarojs/taro'
import { Component } from 'react'

class App extends Component {
  
  // 设置视口高度CSS变量，解决移动浏览器100vh问题
  setViewportHeight = () => {
    // 仅在H5环境下执行
    if (process.env.TARO_ENV === 'h5') {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
  }
  setVhUnit = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  
  componentDidMount() {
    // 设置初始视口高度
    this.setViewportHeight()
    window.addEventListener('resize', this.setVhUnit)
    this.setVhUnit()
    
    // 监听窗口大小变化，更新视口高度
    if (process.env.TARO_ENV === 'h5' && typeof window !== 'undefined') {
      window.addEventListener('resize', this.setViewportHeight)
      window.addEventListener('orientationchange', this.setViewportHeight)
    } 
  }

  componentWillUnmount() {
    // 移除事件监听器
    if (process.env.TARO_ENV === 'h5' && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.setViewportHeight)
      window.removeEventListener('orientationchange', this.setViewportHeight)
    }
  }

  onLaunch() {
    console.log('小程序启动')
  }

  render() {
    return this.props.children
  }
}

export default App