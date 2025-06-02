const fs = require("fs");
const path = require("path");

// 目標資料夾路徑，假設與此腳本位於同一資料夾
const directoryPath = __dirname;

// 讀取指定資料夾內所有檔案
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error("讀取資料夾時發生錯誤: ", err);
    return;
  }

  // 篩選出 .md 副檔名的檔案
  const mdFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".md",
  );

  mdFiles.forEach((file) => {
    const filePath = path.join(directoryPath, file);

    // 分離原始檔名與副檔名
    const ext = path.extname(file);
    const base = path.basename(file, ext);

    // 檢查原始檔名（不含副檔名）是否為兩位數字
    if (!/^\d{2}$/.test(base) || base === "00") {
      console.log(`檔案 ${file} 的檔名不為兩位數字，略過重新命名`);
      return;
    }

    // 讀取檔案內容
    fs.readFile(filePath, "utf8", (err, content) => {
      if (err) {
        console.error(`讀取檔案 ${file} 時發生錯誤: `, err);
        return;
      }

      // 利用正規表達式抓取 front-matter 區塊（以 --- 為包圍）
      const frontMatterRegex = /^---\s*([\s\S]+?)\s*---/;
      const match = content.match(frontMatterRegex);
      if (!match) {
        console.log(`檔案 ${file} 沒有找到 front-matter`);
        return;
      }

      // 取得 front-matter 區塊內容
      const fmContent = match[1];
      const lines = fmContent.split("\n");
      let title = null;

      for (let line of lines) {
        const titleMatch = line.match(/^title\s*:\s*(.+)$/i);
        if (titleMatch) {
          title = titleMatch[1].trim();
          break;
        }
      }

      if (!title) {
        console.log(`檔案 ${file} 沒有找到 title 欄位，略過重新命名`);
        return;
      }

      // 移除包覆在引號中的字串 (例如："MyTitle")
      if (
        (title.startsWith('"') && title.endsWith('"')) ||
        (title.startsWith("'") && title.endsWith("'"))
      ) {
        title = title.slice(1, -1);
      }

      // 處理 title：小寫、空白轉 -、移除特殊字元、合併多個 -
      title = title
        .toLowerCase()
        .replace(/\s+/g, "-") // 空白換成 -
        .replace(/[^a-z0-9-]/g, "") // 移除特殊符號
        .replace(/-+/g, "-") // 多個 - 合併為一個
        .replace(/^-+|-+$/g, ""); // 去掉開頭與結尾的 -

      const newFilename = `${base}-${title}${ext}`;
      const newFilePath = path.join(directoryPath, newFilename);

      // 使用 fs.rename 重新命名檔案
      fs.rename(filePath, newFilePath, (err) => {
        if (err) {
          console.error(`重新命名檔案 ${file} 時發生錯誤: `, err);
        } else {
          console.log(`檔案 ${file} 已重新命名為 ${newFilename}`);
        }
      });
    });
  });
});
