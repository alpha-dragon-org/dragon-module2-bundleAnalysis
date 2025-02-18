# Intro to Dragon Data-Modules

Dragon is a browser extension that visualizes the power concentrations of any token on the Solana blockchain. The extension is separated into "data-modules" that produce different analyses on a token's holders. This initial release includes four data-modules, and the module of focus for this bounty is:

**2. Bundle Analysis**
- An analysis of any bundled supply still holding (number of active bundles, percentage held in active bundles, number of wallets per bundle, etc.)
  
Soon, developers will contribute their own modules to Dragon based on what they think is important for traders to know when in the trenches. 

---

## Table of Contents

- [Intro to Dragon Data-Modules](#intro-to-dragon-data-modules)
- [Table of Contents](#table-of-contents)
  - [Contribution Overview](#contribution-overview)
  - [Folder Structure](#folder-structure)
  - [Setup \& Installation](#setup--installation)
  - [Bounty Details](#bounty-details)
  - [Using Helius RPC for Integration](#using-helius-rpc-for-integration)
  - [Future Bounties](#future-bounties)
  - [Contributing](#contributing)
  - [Issues](#issues)
  - [License](#license)

---

## Contribution Overview

Each of Dragon's first four modules currently gather data by web-scraping TrenchyBot, Trench Radar, and Bubblemaps. The challenge is to build a pipeline that connects the Bounty Analysis module with a Solana RPC (ie. [Helius](https://www.helius.dev)) to replace all scrapes. If any data can not be retrieved from the RPC, the developer can use whatever means necessary given the goals stated in [Bounty Details](#bounty-details) below.

By replacing web-scrapes with RPCs, Dragon will produce real-time data for traders and become an unbeatable companion in the trenches.

---

## Folder Structure



```
dragon-data-modules/
├── package.json             # Project metadata and node dependencies
├── README.md                # This file
├── src
│   ├── api
│   │   └── server.js        # Express API server for data storage and retrieval which connects to the endpoints
│   ├── config
│   │   └── config.js        # Configuration file (ports, API keys, Helius RPC endpoint)
│   ├── modules
│   │   ├── bundleAnalysis.js   # Module for Bundle Analysis
│   │   ├── clusterAnalysis.js  # Module for Cluster Analysis
│   │   ├── tokenInfo.js        # Module for Token Info (Helius RPC integration) 
│   │   └── sniperAnalysis.js   # Module for Sniper Analysis (Helius RPC)
│   ├── telegram
│   │   └── telegramClient.js   # Telegram API integration & message processing which is used for tokenInfo.js and sniperAnalysis.js 
│   └── utils
│       ├── apiUtils.js         # Utility functions for API communication
│       └── telegramUtils.js    # Utility functions for parsing Telegram messages
│
└── frontend                  # Frontend code for the developer to test the backend
    ├── node_modules
    ├── public                # Contains static assets like images and stylesheets
    │   ├── css
    │   │   └── styles.css    
    │   ├── images
    │   └── js
    │       ├── chart2.js
    │       ├── charts.js    # Contains the frontend logic and connection requests to the backend 
    │       └── sidepanel.js
    ├── lib
    │   ├── fontawesome
    │   ├── chart.js
    │   └── vis-network.min.js
    ├── index.html           # The main entry point of the frontend, to all scripts and server
    ├── package-lock.json
    ├── package.json         # Manage dependencies and configurations for frontend
    └── server.js            # A backend entry point or middleware for API interaction

```

---

## Setup & Installation

1. **Clone the repository.**

   ```bash
   git clone https://github.com/alpha-dragon-dev/dragon-module2-bundleAnalysis.git
   cd dragon-module2-bundleAnalysis
   ```

2. **Install Dependencies:**

   Install all required Node.js packages by running:

   ```bash
   npm install
   ```

3. **Configure the Application:**

   Open `src/config/config.js` and update the following parameters as needed:

   - `API_SERVER_PORT` and `TELEGRAM_SERVER_PORT`: Set the ports for the API and Telegram servers.
   - `TELEGRAM_API_ID` and `TELEGRAM_API_HASH`: Replace with your Telegram API credentials.
   - `HELIUS_RPC_URL`: Update with your Helius RPC endpoint and API key. This endpoint is used for blockchain data queries.

4. **Run the Servers:**

   Start the API server in one terminal:

   ```bash
   npm start
   ```

   And then start the Telegram client (which also includes a small Express server) in another terminal:

   ```bash
   npm run telegram
   ```
5. **To View Results on Frontend:**
   Start the API server to fetch data from backend:

   ```bash
   cd frontend
   npm install
   npm start
   ```   

   View results on:

   ```bash
   http://localhost:8080/
   ```



---

## Bounty Details

- **Module Name:** Bundle Analysis 
- **Bounty:** 0.15% of $DRAGON supply  
- **Goal:** Retrieve all data below in real-time and with extremely high accuracy.


### Data To Fetch

- **Total # of Active Bundles**  
   **Example Output:** `3`

- **Total % in Active Bundles**  
   **Example Output:** `32.2`

- **# of Wallets per Bundle**  
  **Metadata Example:** `4`

- **% Active per Bundle**  
   **Metadata Example:** `30.0`

---

### Module Output

- **# of Wallets per Bundle 2:**  
  *Example:* `2`

- **% Active in Bundle 2:**  
  *Example:* `2.2`

- - **Charts containg bundles**  
- **Bundle Analysis:**  
  - **Bundle ID:** `319729266`
  - **Token %:** `32.4395%`
  - **Holding %:** `30.0000%`
  - **This Bundle %:** `92.48%`

- **Active Bundles:**  
  *Example:* `2`  
  **Total Holding:** `32.2%`
---

## Using Helius RPC for Integration

[Helius](https://www.helius.dev) is a powerful RPC service that enables quick and direct access to on-chain data on Solana. By integrating Helius RPC calls into Dragon's data-modules, we can **replace slow web-scraping** and **enhance data accuracy.** 

**How to update the code**
- **Modify the stub functions:** In files like `src/modules/tokenInfo.js` and `src/api/server.js`, update the stub implementations to call the appropriate Helius RPC endpoints.
- **Leverage the configured endpoints:** Use the `HELIUS_RPC_URL` from `src/config/config.js` to ensure that your RPC calls are directed to the correct endpoint with your API key.
- **Improve performance:** Integrate batching of RPC calls if necessary to further improve response time.

*Note:* If any data can not be retrieved from Helius, the developer can use whatever means necessary.

---

## Future Bounties

Dragon’s aim is to make data analyses more transparent and community-driven. After the initial four modules, bounties will expand to include more analyses on holder distributions and deception tactics used on token supply.

If you have an idea for a data-module that could benefit traders in the trenches, please propose it [here](https://github.com/alpha-dragon-org/dragon-module-openIdeas) and start working for that bounty!

---

## Contributing

1. **Fork the repository.**

2. **Create a feature branch.**

   ```bash
   git checkout -b feature/updated-module
   ```

3. **Replace** `server.js`, `tokenInfo.js`, `apiUtils.js`, **and** `telegramUtils.js` **with your stub functions.**


4. **Commit your changes.**

   ```bash
   git commit -am 'Add updated module for XYZ'
   ```

5. **Push the branch.**

   ```bash
   git push origin feature/updated-module
   ```

6. **Open a pull request describing your changes and the code you have contributed.**

---
## Issues

Please report any software “bugs” or other problems with this module through the issues tab here: [github.com/alpha-dragon-org/dragon-module2-bundleAnalysis](https://github.com/alpha-dragon-org/dragon-module2-bundleAnalysis)

---
## License

This project is open source and available under [the MIT License](https://opensource.org/license/mit).

---
<img src="https://github.com/alpha-dragon-org/dragon-module1-tokeninfo/blob/main/frontend/public/images/logo.gif?raw=true" width="200">
Want to meet the project co-founders?

