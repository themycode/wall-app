// src/components/WallpaperGrid/index.jsx

import Taro from "@tarojs/taro";
import { View, Input, ScrollView } from "@tarojs/components";
import { useReachBottom, getSystemInfo } from "@tarojs/taro";
import { useState, useEffect, useRef } from "react";
import WallpaperItem from "../WallpaperItem";
import FullScreenImage from "../FullScreenImage";
import { getDailyWallpapers, searchWallpapers } from "../../services/wallpaper";
import "./index.scss";

// 预定义的壁纸分类
const CATEGORIES = [
  { id: "all", name: "全部" },
  { id: "nature", name: "自然" },
  { id: "abstract", name: "抽象" },
  { id: "animals", name: "动物" },
  { id: "city", name: "城市" },
  { id: "flowers", name: "花卉" },
  { id: "dark", name: "暗色" },
  { id: "minimal", name: "简约" },
];

export default function WallpaperGrid({}) {
  // 获取屏幕尺寸（小程序可通过API获取）
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    date: "",
    total: 0,
    currentPage: 1,
    perPage: 15,
    wallpapers: [],
  });
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef(null);

  // 加载壁纸数据
  const loadWallpapers = async (
    pageNum = 1,
    category = selectedCategory,
    query = searchQuery
  ) => {
    if (loading) return;

    setLoading(true);
    try {
      let newData;

      // 如果有搜索查询或选择了特定分类（非全部），则使用搜索API
      if (query || category !== "all") {
        const searchTerm = query || category;
        newData = await searchWallpapers(searchTerm, pageNum, data.perPage);
      } else {
        // 否则加载每日精选
        const today = new Date().toISOString().split("T")[0]; // 格式：YYYY-MM-DD
        newData = await getDailyWallpapers(today, pageNum, data.perPage);
      }

      // 合并新旧数据
      if (pageNum === 1) {
        setData(newData);
      } else {
        setData({
          ...newData,
          wallpapers: [...data.wallpapers, ...newData.wallpapers],
        });
      }
    } catch (error) {
      console.error("加载壁纸失败:", error);
      Taro.showToast({
        title: "加载失败，请重试",
        icon: "none",
      });
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadWallpapers(1, "all", "");
  }, []);

  // 当分类改变时重新加载
  useEffect(() => {
    loadWallpapers(1, selectedCategory, searchQuery);
  }, [selectedCategory]);


  // 处理搜索输入
  const handleSearchInput = (e) => {
    const value = e.detail.value;
    setSearchQuery(value);

    // 防抖处理，避免频繁请求
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value) {
      setIsSearching(true);
      searchTimeout.current = setTimeout(() => {
        loadWallpapers(1, selectedCategory, value);
      }, 500);
    } else {
      // 如果搜索框清空，重置为当前分类的壁纸
      searchTimeout.current = setTimeout(() => {
        loadWallpapers(1, selectedCategory, "");
      }, 500);
    }
  };

  // 触底加载更多
  useReachBottom(() => {
    if (data.wallpapers.length < data.total) {
      loadWallpapers(data.currentPage + 1, selectedCategory, searchQuery);
    }
  });

  // 按照布局分组
  const groupByColumns = () => {
    // 根据屏幕宽度决定列数
    const windowInfo = Taro.getWindowInfo();
    const screenWidth = windowInfo.windowWidth;

    // 更精细的响应式布局
    let columnCount;
    if (screenWidth < 320) {
      columnCount = 2; // 非常窄的屏幕
    } else if (screenWidth < 480) {
      columnCount = 3; // 手机竖屏
    } else if (screenWidth < 768) {
      columnCount = 4; // 手机横屏或小平板
    } else {
      columnCount = 5; // 大屏设备
    }

    const groups = Array.from({ length: columnCount }, () => []);
    data.wallpapers.forEach((item, index) => {
      groups[index % columnCount].push(item);
    });
    return groups;
  };

  // 显示全屏图片
  const onFullScreen = (imageUrl) => {
    // 在小程序环境中使用原生预览API
    if (process.env.TARO_ENV !== "h5") {
      // 收集所有壁纸的URL，以便可以滑动查看
      const allImageUrls = data.wallpapers
        .map((item) => item.imageUrl)
        .filter(Boolean);

      Taro.previewImage({
        current: imageUrl, // 当前显示图片的链接
        urls: allImageUrls.length > 0 ? allImageUrls : [imageUrl], // 所有图片链接列表
      });
    } else {
      // 在H5环境中使用自定义全屏组件
      setFullScreenImageUrl(imageUrl);
      setShowFullScreen(true);
    }
  };

  // 关闭全屏图片 (仅用于H5环境)
  const handleCloseFullScreen = () => {
    setShowFullScreen(false);
    setFullScreenImageUrl("");
  };

  // 处理触摸移动事件 - 只在极端情况下阻止下拉
  const handleTouchMove = (e) => {
    // 获取触摸点的Y坐标
    const touchY = e.touches[0].clientY;
    // 获取页面滚动位置
    const scrollTop = e.currentTarget.scrollTop;

    // 只有在顶部且明显下拉时才阻止默认行为
    if (scrollTop <= 0 && touchY > 30) {
      // 允许小幅度的下拉，只阻止大幅度下拉刷新
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // 处理分类点击
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery(""); // 清空搜索框
  };

  return (
    <View className="page-wrapper">
      <ScrollView
        scrollY
        enhanced
        enableFlex
        bounces={false}
        // enableFlex
        scrollWithAnimation
        showScrollbar={false}
        className="wallpaper-grid"
        onTouchMove={handleTouchMove}
      >
        <View className="grid-header">
          {/* 只保留搜索框 */}
          <View className="search-container">
            <Input
              className="search-input"
              placeholder="搜索壁纸..."
              value={searchQuery}
              onInput={handleSearchInput}
              confirmType="search"
              adjustPosition={false}
            />
            {isSearching && <View className="search-loading"></View>}
          </View>

          {/* 分类选择器 */}
          <View className="categories-container" scrollX showScrollbar={false}>
            {CATEGORIES.map((category) => (
              <View
                key={category.id}
                className={`category-item ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </View>
            ))}
          </View>
        </View>

        {data.wallpapers.length > 0 ? (
          <View className="grid-container">
            {groupByColumns().map((column, colIndex) => (
              <View
                key={colIndex}
                className="grid-column"
                style={{
                  flex: 1,
                  marginRight:
                    colIndex === groupByColumns().length - 1 ? "0" : "0",
                }}
              >
                {column.map((item) => (
                  <WallpaperItem
                    key={item.id}
                    item={item}
                    onFullScreen={onFullScreen}
                  />
                ))}
              </View>
            ))}
          </View>
        ) : (
          !loading && (
            <View className="no-results">
              <View className="no-results-icon">🔍</View>
              <View className="no-results-text">
                {searchQuery
                  ? `没有找到与"${searchQuery}"相关的壁纸`
                  : "没有找到相关壁纸"}
              </View>
            </View>
          )
        )}

        {loading && (
          <View className="loading-text">
            <View className="loading-spinner"></View>
            <View>正在加载更多壁纸...</View>
          </View>
        )}

        {!loading && data.wallpapers.length >= data.total && data.total > 0 && (
          <View className="no-more-text">没有更多壁纸了</View>
        )}

        {/* 全屏图片组件 */}
        {showFullScreen && (
          <FullScreenImage
            imageUrl={fullScreenImageUrl}
            onClose={handleCloseFullScreen}
          />
        )}
      </ScrollView>
    </View>
  );
}
// import Taro from '@tarojs/taro'
// import { View, ScrollView } from '@tarojs/components'
// import { useReachBottom } from '@tarojs/taro'
// import { useState, useEffect } from 'react'
// import WallpaperItem from '../WallpaperItem'
// import { getDailyWallpapers } from '../../services/wallpaper'
// import './index.scss'

// export default function WallpaperGrid({ date }) {
//   const [loading, setLoading] = useState(false)
//   const [data, setData] = useState({
//     date: date,
//     total: 0,
//     currentPage: 1,
//     perPage: 15,
//     wallpapers: []
//   })

//   // 加载壁纸数据
//   const loadWallpapers = async (pageNum = 1) => {
//     if (loading) return

//     setLoading(true)
//     try {
//       const newData = await getDailyWallpapers(date, pageNum, data.perPage)
//       console.log("newData:",newData)

//       // 合并新旧数据
//       if (pageNum === 1) {
//         setData(newData)
//       } else {
//         setData({
//           ...newData,
//           wallpapers: [...data.wallpapers, ...newData.wallpapers]
//         })
//       }
//     } finally {
//       setLoading(false)
//     }
//   }

//   // 初始化加载
//   useEffect(() => {
//     loadWallpapers(1)
//   }, [date])

//   // 触底加载更多
//   useReachBottom(() => {
//     if (data.wallpapers.length < data.total) {
//       loadWallpapers(data.currentPage + 1)
//     }
//   })

//   // 按照三列布局分组
//   const groupByColumns = () => {
//     const groups = [[], [], []]
//     data.wallpapers.forEach((item, index) => {
//       groups[index % 3].push(item)
//     })
//     return groups
//   }

//   return (
//     <ScrollView className='wallpaper-grid' scrollY>
//       <View className='grid-header'>
//         <View className='date-time'>{data.date}</View>
//         <View className='featured-tag'>每日精选</View>
//       </View>

//       <View className='grid-container'>
//         {groupByColumns().map((column, colIndex) => (
//           <View key={colIndex} className='grid-column'>
//             {column.map(item => (
//               <WallpaperItem key={item.id} item={item} />
//             ))}
//           </View>
//         ))}
//       </View>

//       {loading && (
//         <View className='loading-text'>正在加载更多壁纸...</View>
//       )}

//       {!loading && data.wallpapers.length >= data.total && data.total > 0 && (
//         <View className='no-more-text'>没有更多壁纸了</View>
//       )}
//     </ScrollView>
//   )
// }
