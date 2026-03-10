import Taro from "@tarojs/taro";

// 数据源配置
const DATA_SOURCE = "wechat"; // 'pixabay' 或 'wechat'

// Pixabay API配置
const PIXABAY_API_BASE = "https://pixabay.com";
const PIXABAY_API_KEY = "xxx";

// 微信公众号API配置
const WECHAT_API_BASE = "https://api.weixin.qq.com"; // 微信公众号API地址
const TOKEN_SERVICE_URL = "http://localhost:3000/token"; // token服务地址

// 将Pixabay API响应转换为应用所需的壁纸数据格式
const transformPixabayResponse = (data, date, page, perPage) => {
  if (data && Array.isArray(data.hits)) {
    return {
      date: date,
      total: data.totalHits || 0,
      currentPage: page,
      perPage: perPage,
      wallpapers: data.hits.map((wp) => ({
        id: wp.id,
        title: wp.tags || "未命名壁纸",
        thumbnailUrl: wp.previewURL || wp.webformatURL || "", // Pixabay提供的缩略图URL
        imageUrl: wp.largeImageURL || wp.webformatURL || "", // Pixabay提供的大图URL
        date: date,
        featured: wp.featured || false,
        resolution: `${wp.imageWidth || 0}x${wp.imageHeight || 0}`,
        sizeKb: Math.round((wp.imageSize || 0) / 1024) || 0,
        downloadCount: wp.downloads || 0,
        category: getCategoryFromTags(wp.tags || ""),
      })),
    };
  } else {
    // 返回有效的空数据结构
    return {
      date,
      total: 0,
      currentPage: page,
      perPage,
      wallpapers: [],
    };
  }
};

// 将微信公众号素材响应转换为应用所需的壁纸数据格式
const transformWechatResponse = (data, date, page, perPage) => {
  const { item = [], total_count = 0 } = data || {};

  // 将微信公众号素材转换为壁纸格式
  const wallpapers = item.map((mediaItem, index) => {
    // 微信公众号素材的URL在url字段中
    const imageUrl = mediaItem.url || "";

    // 生成唯一ID（使用media_id或索引）
    const id = mediaItem.media_id || `wechat-${Date.now()}-${index}`;

    // 从名称或描述中提取标题
    const title = mediaItem.name || "微信公众号壁纸";

    return {
      id,
      title,
      thumbnailUrl: imageUrl, // 使用相同的URL作为缩略图
      imageUrl, // 大图URL
      date,
      featured: false,
      resolution: "1080x1920", // 默认分辨率
      sizeKb: 0, // 微信API可能不提供文件大小
      downloadCount: 0, // 微信API可能不提供下载数
      category: "all", // 默认分类
    };
  });

  return {
    date,
    total: total_count,
    currentPage: page,
    perPage,
    wallpapers,
  };
};

// 从微信公众号获取图片素材
const getWechatMediaWallpapers = async (page = 1, perPage = 20) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 计算偏移量，微信API使用offset而不是page
    const offset = (page - 1) * perPage;

    // 首先从token服务获取access_token
    const tokenRes = await Taro.request({
      url: TOKEN_SERVICE_URL,
      method: "GET",
      timeout: 10000,
    });

    if (tokenRes.statusCode !== 200 || !tokenRes.data.access_token) {
      console.error("获取access_token失败:", tokenRes);
      return {
        date: today,
        total: 0,
        currentPage: page,
        perPage,
        wallpapers: [],
      };
    }

    const accessToken = tokenRes.data.access_token;

    // 使用获取到的access_token调用微信公众号素材API
    const res = await Taro.request({
      url: `${WECHAT_API_BASE}/cgi-bin/material/batchget_material?access_token=${accessToken}`,
      method: "POST",
      data: {
        type: "image",
        offset,
        count: perPage,
      },
      timeout: 10000,
    });

    if (res.statusCode === 200) {
      return transformWechatResponse(res.data, today, page, perPage);
    } else {
      console.error("获取微信素材失败:", res);
      return {
        date: today,
        total: 0,
        currentPage: page,
        perPage,
        wallpapers: [],
      };
    }
  } catch (error) {
    console.error("获取微信素材失败:", error);
    const today = new Date().toISOString().split("T")[0];
    return {
      date: today,
      total: 0,
      currentPage: page,
      perPage,
      wallpapers: [],
    };
  }
};

// 从标签中提取可能的分类
const getCategoryFromTags = (tags) => {
  const tagsList = tags.toLowerCase().split(", ");
  const categoryMap = {
    nature: [
      "nature",
      "landscape",
      "mountain",
      "forest",
      "sea",
      "ocean",
      "lake",
      "river",
    ],
    abstract: ["abstract", "pattern", "texture", "minimal"],
    animals: ["animal", "dog", "cat", "bird", "wildlife", "pet"],
    city: ["city", "urban", "architecture", "building", "skyline"],
    flowers: ["flower", "floral", "rose", "tulip", "plant"],
    dark: ["dark", "black", "night", "shadow"],
    minimal: ["minimal", "simple", "clean", "minimalist"],
  };

  // 检查标签是否匹配任何分类
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (
      keywords.some((keyword) => tagsList.some((tag) => tag.includes(keyword)))
    ) {
      return category;
    }
  }

  return "all"; // 默认分类
};

// 获取每日精选壁纸 - 根据数据源配置选择API
export const getDailyWallpapers = async (date, page = 1, perPage = 15) => {
  // 根据数据源配置选择API
  if (DATA_SOURCE === "wechat") {
    return getWechatMediaWallpapers(page, perPage);
  } else {
    // 默认使用Pixabay API
    try {
      const res = await Taro.request({
        url: `${PIXABAY_API_BASE}/api/`,
        method: "GET",
        data: {
          key: PIXABAY_API_KEY,
          q: "phone+wallpaper",
          image_type: "photo",
          pretty: true,
          page: page,
          per_page: perPage,
          safesearch: true,
          min_width: 1080,
          min_height: 1920,
        },
        timeout: 10000, // 添加超时设置
      });

      if (res.statusCode === 200) {
        return transformPixabayResponse(res.data, date, page, perPage);
      } else {
        // 返回有效的空数据结构
        return {
          date,
          total: 0,
          currentPage: page,
          perPage,
          wallpapers: [],
        };
      }
    } catch (error) {
      console.error("获取壁纸失败:", error);
      // 返回结构化的空数据
      return {
        date,
        total: 0,
        currentPage: page,
        perPage,
        wallpapers: [],
      };
    }
  }
};

// 搜索壁纸 - 根据关键词搜索，支持多数据源
export const searchWallpapers = async (query, page = 1, perPage = 15) => {
  // 获取当前日期
  const today = new Date().toISOString().split("T")[0];

  // 根据数据源配置选择API
  if (DATA_SOURCE === "wechat") {
    try {
      // 对于微信公众号，我们先获取所有图片，然后在前端进行过滤
      const result = await getWechatMediaWallpapers(page, perPage);

      // 如果有查询关键词，尝试在名称或描述中进行简单过滤
      if (query && query !== "all" && query.trim() !== "") {
        const lowerQuery = query.toLowerCase();

        // 过滤包含关键词的壁纸
        const filteredWallpapers = result.wallpapers.filter((wallpaper) => {
          const title = (wallpaper.title || "").toLowerCase();
          return title.includes(lowerQuery);
        });

        return {
          date: today,
          total: filteredWallpapers.length,
          currentPage: page,
          perPage,
          wallpapers: filteredWallpapers,
        };
      }

      // 如果没有关键词或是"all"分类，返回所有结果
      return result;
    } catch (error) {
      console.error("搜索微信素材失败:", error);
      return {
        date: today,
        total: 0,
        currentPage: page,
        perPage,
        wallpapers: [],
      };
    }
  } else {
    // 默认使用Pixabay API
    try {
      // 构建搜索查询 - 始终将用户输入与"phone wallpaper"拼接
      let searchQuery = "";

      // 如果是预定义分类，使用分类名+phone wallpaper
      if (
        [
          "nature",
          "abstract",
          "animals",
          "city",
          "flowers",
          "dark",
          "minimal",
        ].includes(query)
      ) {
        searchQuery = `${query}+phone+wallpaper`;
      }
      // 如果是"all"分类或空查询，只使用"phone wallpaper"
      else if (query === "all" || !query) {
        searchQuery = "phone+wallpaper";
      }
      // 其他用户输入的搜索词，与"phone wallpaper"拼接
      else {
        searchQuery = `${query}+phone+wallpaper`;
      }

      console.log("搜索查询:", searchQuery); // 调试日志

      const res = await Taro.request({
        url: `${PIXABAY_API_BASE}/api/`,
        method: "GET",
        data: {
          key: PIXABAY_API_KEY,
          q: searchQuery,
          image_type: "photo",
          pretty: true,
          page: page,
          per_page: perPage,
          safesearch: true,
          orientation: "vertical", // 优先获取垂直方向的图片，更适合手机壁纸
        },
        timeout: 10000,
      });

      if (res.statusCode === 200) {
        return transformPixabayResponse(res.data, today, page, perPage);
      } else {
        return {
          date: today,
          total: 0,
          currentPage: page,
          perPage,
          wallpapers: [],
        };
      }
    } catch (error) {
      console.error("搜索壁纸失败:", error);
      return {
        date: today,
        total: 0,
        currentPage: page,
        perPage,
        wallpapers: [],
      };
    }
  }
};
