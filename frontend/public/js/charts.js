document.addEventListener("DOMContentLoaded", () => {
  // Hide bundle message initially
  const bundleMessageElement = document.getElementById("bundleDistMessage");
  if (bundleMessageElement) {
    bundleMessageElement.style.display = "none";
  }

  /**********************
   * RESET FUNCTIONS
   **********************/
  function resetFields() {
    // Reset the bundle stats placeholders in both the left and right columns
    const activeBundlesLeftElement = document.querySelector(
      ".bundle-stats div:nth-child(1) strong"
    );
    const totalHoldingLeftElement = document.querySelector(
      ".bundle-stats div:nth-child(2) strong"
    );
    const activeBundlesOutputElement = document.querySelector(
      ".bundle-output-stats div:nth-child(1) strong"
    );
    const totalHoldingOutputElement = document.querySelector(
      ".bundle-output-stats div:nth-child(2) strong"
    );

    if (activeBundlesLeftElement) activeBundlesLeftElement.textContent = "Loading...";
    if (totalHoldingLeftElement) totalHoldingLeftElement.textContent = "Loading...";
    if (activeBundlesOutputElement) activeBundlesOutputElement.textContent = "Loading...";
    if (totalHoldingOutputElement)
      totalHoldingOutputElement.textContent = "Loading...";

    console.log("[INFO] Bundle stats reset to placeholders.");
  }

  function resetCharts() {
    const bundleChartContainer = document.querySelector(".bundle-chart-container");
    const bundleMessageElement = document.getElementById("bundleDistMessage");

    if (bundleChartContainer) {
      // Clear old charts
      bundleChartContainer.innerHTML = "";
      // Provide a placeholder box if desired
      const emptyContainer = document.createElement("div");
      emptyContainer.style.width = "253.2px";
      emptyContainer.style.height = "158.2px";
      emptyContainer.style.backgroundColor = "#FFFFFF0D";
      bundleChartContainer.appendChild(emptyContainer);
    }
    if (bundleMessageElement) {
      bundleMessageElement.innerHTML = "";
      bundleMessageElement.style.display = "none";
    }
    if (window.bundleChartsArray && window.bundleChartsArray.length) {
      window.bundleChartsArray.forEach((chart) => chart.destroy());
      window.bundleChartsArray = [];
    }
    console.log("[INFO] Bundle charts reset.");
  }

  /**********************
   * API ACTION FUNCTIONS
   **********************/
  async function sendContractAddressToBot(contractAddress) {
    const apiEndpoint =
      // "http://ec2-3-80-88-97.compute-1.amazonaws.com:3001/sendContractAddress";
      "http://localhost:3001/sendContractAddress";

      

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractAddress }),
      });
      if (response.ok) {
        console.log("[INFO] Contract address sent successfully:", contractAddress);
      } else {
        console.error(
          "[ERROR] Failed to send contract address. Response:",
          response.status
        );
      }
    } catch (error) {
      console.error("[ERROR] Error sending contract address:", error.message);
    }
  }

  async function clearAPIData() {
    try {
      const response = await fetch(
        // "http://ec2-3-80-88-97.compute-1.amazonaws.com:3000/clearData",
        "http://localhost:3000/clearData",

        { method: "POST" }
      );
      if (response.ok) {
        console.log("[INFO] API data cleared successfully.");
      } else {
        console.error("[ERROR] Failed to clear API data:", response.statusText);
      }
    } catch (error) {
      console.error("[ERROR] Error clearing API data:", error);
    }
  }

  /**********************
   * BUNDLE ANALYSIS CHART FUNCTIONS
   **********************/
  function updateBundleStats(data) {
    const secondItem = data[0];
    const bundleData = secondItem?.bundleData?.bundleData;
    const activeBundlesCount = Array.isArray(bundleData) ? bundleData.length : 0;

    // Update Active Bundles in left column
    const activeBundlesLeftElement = document.querySelector(
      ".bundle-stats div:nth-child(1) strong"
    );
    if (activeBundlesLeftElement) {
      activeBundlesLeftElement.textContent = activeBundlesCount || "0";
    }

    // Update Active Bundles in output section
    const activeBundlesOutputElement = document.querySelector(
      ".bundle-output-stats div:nth-child(1) strong"
    );
    if (activeBundlesOutputElement) {
      activeBundlesOutputElement.textContent = activeBundlesCount || "0";
    }
  }

  function updateBundleDistChart(apiData) {
    const bundleMessageElement = document.getElementById("bundleDistMessage");
    const bundleChartContainer = document.querySelector(".bundle-chart-container");

    if (!bundleChartContainer) {
      console.error("[Bundle Chart] .bundle-chart-container not found.");
      return;
    }

    try {
      if (!apiData || !Array.isArray(apiData) || apiData.length < 1) {
        console.error("[Bundle Chart] Invalid API data structure:", apiData);
        return;
      }

      const bundleInfo = apiData[0]?.bundleData?.bundleData;
      const leftPanelData = apiData[0]?.bundleData?.leftPanelData;
      if (!leftPanelData) {
        console.error("[Bundle Chart] Missing left panel data.");
        return;
      }

      // Update "Total Holding" stat in left column and output section
      const totalHoldingLeftElement = document.querySelector(
        ".bundle-stats div:nth-child(2) strong"
      );
      const totalHoldingOutputElement = document.querySelector(
        ".bundle-output-stats div:nth-child(2) strong"
      );
      const heldPercent = parseFloat(leftPanelData["Held Percentage"] || "0");
      if (totalHoldingLeftElement) {
        totalHoldingLeftElement.textContent = `${heldPercent.toFixed(1)}%`;
      }
      if (totalHoldingOutputElement) {
        totalHoldingOutputElement.textContent = `${heldPercent.toFixed(1)}%`;
      }

      // If no bundles exist, show message
      if (!bundleInfo || !bundleInfo.length) {
        if (bundleMessageElement) {
          bundleMessageElement.textContent =
            "It looks like everything held has been sold.";
          bundleMessageElement.style.display = "block";
        }
        bundleChartContainer.style.display = "none";
        return;
      }

      // Otherwise, show the chart container
      bundleChartContainer.style.display = "flex";
      if (bundleMessageElement) {
        bundleMessageElement.style.display = "none";
      }

      // Convert each bundle's percentage to numeric
      const numericBundleData = bundleInfo.map((bundle) => {
        const rawPercent = parseFloat(bundle.percentage.replace("%", "")) || 0;
        const bundleID = bundle.title.match(/Bundle ID: (\d+)/)?.[1];
        const tokenPercentMatch = bundle.title.match(/Token %:\s([\d\.]+)%/);
        const holdingPercentMatch = bundle.title.match(/Holding %:\s([\d\.]+)%/);

        const tokenPercent = tokenPercentMatch ? parseFloat(tokenPercentMatch[1]) : 0;
        const holdingPercent = holdingPercentMatch ? parseFloat(holdingPercentMatch[1]) : 0;

        return {
          ...bundle,
          numericPercent: rawPercent,
          bundleID,
          tokenPercent,
          holdingPercent,
        };
      });

      const maxPercent = Math.max(...numericBundleData.map((b) => b.numericPercent));

      // Clear previous charts
      bundleChartContainer.innerHTML = "";
      if (window.bundleChartsArray && window.bundleChartsArray.length) {
        window.bundleChartsArray.forEach((ch) => ch.destroy());
      }
      window.bundleChartsArray = [];

      // Create a canvas for each bundle chart
      numericBundleData.forEach((bundle) => {
        const canvas = document.createElement("canvas");
        canvas.className = "bundle-canvas";

        // Size the canvas based on percentage
        const minSize = 120;
        const maxSize = 220;
        let ratio = bundle.numericPercent / maxPercent;
        ratio = Math.max(0, Math.min(1, ratio));
        const canvasSize = minSize + ratio * (maxSize - minSize);

        canvas.style.width = canvasSize + "px";
        canvas.style.height = canvasSize + "px";

        bundleChartContainer.appendChild(canvas);

        // Calculate "This Bundle %" in relation to tokenPercent
        const calcThisBundlePercent =
          bundle.tokenPercent !== 0
            ? (bundle.holdingPercent / bundle.tokenPercent) * 100
            : 0;

        const chartData = {
          labels: ["This Bundle %", "Remaining"],
          datasets: [
            {
              parsing: { key: "value" },
              data: [
                { value: calcThisBundlePercent, bundleID: bundle.bundleID },
                { value: 100 - calcThisBundlePercent, bundleID: bundle.bundleID },
              ],
              backgroundColor: ["rgba(255, 28, 77, 1)", "rgba(128, 128, 128, 0.3)"],
              borderColor: ["rgba(255, 28, 77, 1)", "rgba(128, 128, 128, 0.3)"],
              borderWidth: 1,
            },
          ],
        };

        const chart = new Chart(canvas, {
          type: "pie",
          data: chartData,
          options: {
            responsive: false,
            maintainAspectRatio: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                position: "nearest",
                yAlign: "bottom",
                xAlign: "center",
                usePointStyle: true,
                caretSize: 5,
                backgroundColor: "rgba(0,0,0,0.7)",
                callbacks: {
                  title: () => bundle.title || "Bundle",
                  label: function (context) {
                    const foundBundle = numericBundleData.find(
                      (b) => b.bundleID === context.raw.bundleID
                    );
                    if (foundBundle) {
                      const { tokenPercent, holdingPercent } = foundBundle;
                      if (context.label === "This Bundle %") {
                        const calcVal =
                          tokenPercent !== 0
                            ? (holdingPercent / tokenPercent) * 100
                            : 0;
                        return `${context.label}: ${calcVal.toFixed(2)}%`;
                      } else {
                        const calcVal =
                          tokenPercent !== 0
                            ? (holdingPercent / tokenPercent) * 100
                            : 0;
                        return `${context.label}: ${(100 - calcVal).toFixed(2)}%`;
                      }
                    }
                    return `${context.label}: 0%`;
                  },
                },
              },
            },
          },
        });

        window.bundleChartsArray.push(chart);
      });
    } catch (error) {
      console.error("[Bundle Chart] Error updating chart:", error);
    }
  }

  async function fetchAndUpdateBundleDistChart() {
    try {
      const response = await fetch(
        // "http://ec2-3-80-88-97.compute-1.amazonaws.com:3000/fetchData"
        "http://localhost:3000/fetchData"

      );
      if (!response.ok)
        throw new Error(`[Bundle Chart] HTTP error! Status: ${response.status}`);

      const data = await response.json();
      updateBundleDistChart(data);
      updateBundleStats(data);
    } catch (error) {
      console.error("[Bundle Chart] Error fetching data:", error);
    }
  }

  // Fetch data immediately and then every 10 seconds
  fetchAndUpdateBundleDistChart();
  setInterval(fetchAndUpdateBundleDistChart, 10000);

  /**********************
   * CONTRACT ADDRESS EVENT
   **********************/
  const addressInput = document.querySelector(".address-input");
  if (addressInput) {
    addressInput.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const contractAddress = e.target.value.trim();
        if (!contractAddress) {
          console.warn("[WARNING] Contract address is empty!");
          return;
        }
        console.log("[INFO] New contract address entered:", contractAddress);

        // Reset placeholders and charts
        resetFields();
        resetCharts();

        // Clear old data from the API
        await clearAPIData();

        // Send new contract address to the bot
        await sendContractAddressToBot(contractAddress);
      }
    });
  }
});
