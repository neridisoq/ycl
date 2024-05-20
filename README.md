# ycl

Yangcheon Highschool Lunch

## Table of Contents

-   [Installation](#installation)
-   [Usage](#usage)

## Installation & Usage

0. Set API KEY

    a. Get API KEY in [this page](https://open.neis.go.kr/portal/mainPage.do)
    b. make `.env` at root and write

    ```
    APIKEY=YOUR KEY HERE
    ```

1. Clone the repository:

    ```bash
    git clone https://github.com/dkqdkq/ycl.git
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

    ```bash
    cd frontend
    npm install
    ```

3. Build frontend file

    ```bash
    npm run build
    (in frontend)
    ```

4. Move build folder in src

    ```bash
    mv build ../src
    ```

5. Go to root and start

    ```bash
    npm start
    ```

6. Open your web browser and visit `http://localhost:5000` to access the application.
