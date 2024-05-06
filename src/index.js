const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
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

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/lunch", async (req, res) => {
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
            }
        }
        const { DDISH_NM, CAL_INFO } = mealServiceDietInfo[1].row[0];
        const regex =
            /\([^()]+\)|\/자율|\(완\)|\(선\)|\(교\)|\(주\)|\(해당없음\)|\(양천\)/g;
        const mealDataString = DDISH_NM.replace(/\([^()]+\)|/, "").replace(
            regex,
            ""
        );
        const mealData = mealDataString
            .split("<br/>")
            .map((element) => element.trim());

        res.send({
            meal: mealData,
            cal: CAL_INFO,
        });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
