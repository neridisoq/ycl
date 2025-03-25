const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const path = require("path");
const app = express();
dotenv.config();
const port = 3000;
const APIKEY = process.env.APIKEY;

const ATPT_OFCDC_SC_CODE = "B10";
const SD_SCHUL_CODE = "7010209";

if (!APIKEY) {
    console.log("[YCL] API KEY is not loaded");
} else {
    console.log("[YCL] API KEY is loaded");
}
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/build/index.html");
});

app.get("/meal", async (req, res) => {
    const today = req.query.today;
    console.log(today);
    const url =
        `https://open.neis.go.kr/hub/mealServiceDietInfo?` +
        `Type=json&` +
        `ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}&` +
        `SD_SCHUL_CODE=${SD_SCHUL_CODE}&` +
        `MLSV_YMD=${today}&` +
        `KEY=${APIKEY}`;
    console.log(url);

    try {
        const response = await axios.get(url);
        console.log(response.data);
        const { mealServiceDietInfo } = response.data;
        if (!mealServiceDietInfo) {
            if (response.data.RESULT.CODE === "INFO-200") {
                res.send({
                    message: "데이터가 없습니다.",
                });
                return;
            } else if (response.data.RESULT.CODE !== "INFO-000") {
                res.send({
                    message: "오류가 발생했습니다.",
                });
                console.log(response.data.RESULT.CODE);
                return;
            }
        }
        const lunch_DDISH_NM = mealServiceDietInfo[1]?.row[0]?.DDISH_NM;
        const dinner_DDISH_NM = mealServiceDietInfo[1]?.row[1]?.DDISH_NM;
        let lunch_CAL_INFO = mealServiceDietInfo[1]?.row[0]?.CAL_INFO;
        let dinner_CAL_INFO = mealServiceDietInfo[1]?.row[1]?.CAL_INFO;

        // Modified regex to catch all patterns after a slash
        const slashRegex = /\/[^<]+/g;

        // Process lunch meal data
        const lunchMealDataString = lunch_DDISH_NM
            ?.replace(slashRegex, "")
            ?.replace(/\([^()]+\)/g, "");

        let lunchMealData = lunchMealDataString
            ?.split("<br/>")
            ?.map((element) => element.trim());

        // Process dinner meal data
        const dinnerMealDataString = dinner_DDISH_NM
            ?.replace(slashRegex, "")
            ?.replace(/\([^()]+\)/g, "");

        let dinnerMealData = dinnerMealDataString
            ?.split("<br/>")
            ?.map((element) => element.trim());

        if (!lunchMealData) {
            lunchMealData = ["오늘은 점심이 없습니다."];
            lunch_CAL_INFO = "오늘은 점심이 없습니다.";
        }

        if (!dinnerMealData) {
            dinnerMealData = ["오늘은 저녁이 없습니다."];
            dinner_CAL_INFO = "오늘은 저녁이 없습니다.";
        }

        res.send({
            meal: [lunchMealData, dinnerMealData],
            cal: [lunch_CAL_INFO, dinner_CAL_INFO],
        });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});