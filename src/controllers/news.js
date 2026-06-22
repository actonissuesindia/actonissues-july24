"use strict";
const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
const url = "https://www.globalissues.org/news";

const getNews = async (req, res) => {
  try {
    let getCache = await myCache.get("tranding_news");
    if (getCache) {
      res
        .status(200)
        .json({
          success: true,
          message: "tranding news",
          data: JSON.parse(getCache),
        });
    } else {
      const newsObj = [];
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const listItems = $("#content ol li");
      listItems.each((idx, el) => {
        let news = { heading: "", date: "", img: "", content: "" };
        news.heading = $(el).children("h2").text();
        news.date = $(el).children("p").text();
        news.img = $(el).find("img").attr("src");
        news.content = $(el).find(".summary-with-thumbnail p").text();
        newsObj.push(news);
      });
      let cacheRes = myCache.set(
        "tranding_news",
        JSON.stringify(newsObj),
        60 * 60 * 6
      );
      res
        .status(200)
        .json({ success: true, message: "tranding news", data: newsObj });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  getNews: getNews,
};
