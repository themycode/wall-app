const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// 微信公众号配置
const APPID = "xxxx";
const SECRET = "xxxx";

// 启用CORS，允许小程序访问
app.use(cors());
app.use(express.json());

// 缓存access_token，避免频繁请求
let accessTokenCache = {
  token: null,
  expiresAt: 0,
};

// 获取access_token
async function getAccessToken() {
  // 如果缓存的token仍然有效，直接返回
  const now = Date.now();
  if (accessTokenCache.token && accessTokenCache.expiresAt > now) {
    return accessTokenCache.token;
  }

  try {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${SECRET}`;
    const response = await axios.get(url);
    const data = response.data;

    if (data.access_token) {
      // 缓存token，微信token有效期通常为7200秒（2小时）
      accessTokenCache = {
        token: data.access_token,
        // 设置过期时间比实际提前5分钟，以防止边界情况
        expiresAt: now + (data.expires_in - 300) * 1000,
      };
      return data.access_token;
    } else {
      console.error("获取access_token失败:", data);
      throw new Error("获取access_token失败");
    }
  } catch (error) {
    console.error("获取access_token出错:", error);
    throw error;
  }
}

// 获取微信公众号素材列表
app.post("/material", async (req, res) => {
  try {
    const { type = "image", offset = 0, count = 20 } = req.body;

    // 获取access_token
    const token = await getAccessToken();

    // 调用微信素材管理接口
    const url = `https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${token}`;
    const response = await axios.post(url, {
      type,
      offset,
      count,
    });

    res.json(response.data);
  } catch (error) {
    console.error("获取素材列表失败:", error);
    res.status(500).json({
      error: "获取素材列表失败",
      message: error.message,
    });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`微信API服务器运行在 http://localhost:${port}`);
});
