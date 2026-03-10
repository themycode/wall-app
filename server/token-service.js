const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const port = 3000;

// 启用CORS
app.use(cors());

// 微信公众号配置
const APPID = "xxx";
const SECRET = "xxx";

// 缓存access_token
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

  // 否则，请求新的token
  try {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${SECRET}`;
    const response = await axios.get(url);

    if (response.data && response.data.access_token) {
      // 缓存token，设置过期时间（微信token有效期为7200秒，我们设置为7000秒以确保安全）
      accessTokenCache = {
        token: response.data.access_token,
        expiresAt: now + 7000 * 1000,
      };
      return accessTokenCache.token;
    } else {
      console.error("获取access_token失败:", response.data);
      return null;
    }
  } catch (error) {
    console.error("获取access_token出错:", error);
    return null;
  }
}

// API端点：获取access_token
app.get("/token", async (req, res) => {
  try {
    const token = await getAccessToken();
    if (token) {
      res.json({ access_token: token });
    } else {
      res.status(500).json({ error: "获取access_token失败" });
    }
  } catch (error) {
    console.error("处理token请求出错:", error);
    res.status(500).json({ error: "服务器内部错误" });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Token服务运行在 http://localhost:${port}`);
});
