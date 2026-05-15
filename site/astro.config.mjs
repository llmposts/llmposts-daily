import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://archive.llmposts.com",
  trailingSlash: "ignore",
  build: {
    format: "directory",
  },
  vite: {
    server: {
      // 允许 dev 服务器读取仓库根的 archive/ 目录
      fs: { allow: [".."] },
    },
  },
});
