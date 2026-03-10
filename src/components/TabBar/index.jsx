
import React from 'react';
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
// 静态引入所有图片（必须放在模块顶部）
import homeIcon from '../../assets/tabbar/home.png';
import homeActiveIcon from '../../assets/tabbar/home-active.png';
import widgetsIcon from '../../assets/tabbar/widget.png';
import widgetsActiveIcon from '../../assets/tabbar/widget-active.png';
import aboutIcon from '../../assets/tabbar/about.png';
import aboutActiveIcon from '../../assets/tabbar/about-active.png';
import './index.scss';

const TabBar = () => {
  const iconMap = {
    'index': {
      normal: homeIcon,
      active: homeActiveIcon
    },
    'widgets': {
      normal: widgetsIcon,
      active: widgetsActiveIcon
    },
    'about': {
      normal: aboutIcon,
      active: aboutActiveIcon
    }
  };

  const tabList = [
    {
      title: '首页',
      path: '/pages/index/index'
    },
    {
      title: '组件',
      path: '/pages/widgets/index'
    },
    {
      title: '关于',
      path: '/pages/about/index'
    }
  ];

  const switchTab = (path) => {
    // 如果当前页面路径与目标路径相同，则不进行跳转
    if (getCurrentPath() === path) return;

    // 使用redirectTo而不是switchTab，因为我们使用的是自定义TabBar
    Taro.redirectTo({
      url: path
    });
  };

  const getCurrentPath = () => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];
    return `/${currentPage.route}`;
  };

  const currentPath = getCurrentPath();

  return (
    <View className='custom-tab-bar'>
      {tabList.map((item, index) => {
        const isActive = currentPath === item.path;
        return (
          <View
            key={index}
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => switchTab(item.path)}
          >
            <Image
              className='tab-icon'
              src={
                isActive
                  ? iconMap[item.path.split('/')[2]].active
                  : iconMap[item.path.split('/')[2]].normal
              }
              mode='aspectFit'
              style={{
                transform: isActive ? 'scale(1.2)' : 'scale(1)'
              }}
            />
          </View>
        );
      })}
    </View>
  );
};

export default TabBar;
