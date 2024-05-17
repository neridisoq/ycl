const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const path = require("path");
const app = express();
dotenv.config();
const port = 5000;
const APIKEY = process.env.APIKEY;

const ATPT_OFCDC_SC_CODE = "B10";
const SD_SCHUL_CODE = "7010209";

if (!APIKEY) {
    console.log("[YCL] API KEY is not loaded");
} else {
    console.log("[YCL] API KEY is loaded");
}
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
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
        const lunch_DDISH_NM = mealServiceDietInfo[1].row[0].DDISH_NM;
        const dinner_DDISH_NM = mealServiceDietInfo[1].row[1].DDISH_NM;
        const lunch_CAL_INFO = mealServiceDietInfo[1].row[0].CAL_INFO;
        const dinner_CAL_INFO = mealServiceDietInfo[1].row[1].CAL_INFO;

        const regex =
            /\([^()]+\)|\/자율|\(완\)|\(선\)|\(교\)|\(주\)|\(해당없음\)|\(양천\)/g;

        const lunchMealDataString = lunch_DDISH_NM
            .replace(/\([^()]+\)|/, "")
            .replace(regex, "");

        const lunchMealData = lunchMealDataString
            .split("<br/>")
            .map((element) => element.trim());

        const dinnerMealDataString = dinner_DDISH_NM
            .replace(/\([^()]+\)|/, "")
            .replace(regex, "");

        const dinnerMealData = dinnerMealDataString
            .split("<br/>")
            .map((element) => element.trim());

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
