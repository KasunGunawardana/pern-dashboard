import express from "express";
import dotenv from "dotenv";

// load environment variables as early as possible, before other imports
dotenv.config();

import db from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();

router.post("/", async (req, res) => {
  const { make, model, year, price } = req.body;

  if (!make || model || year || price)
    return res.status(400).json({
      error: "Please provide all the required fields"
    });

  const response = await db
    .insert(cars)
    .values({ make, model, year, price })
    .returning();

  console.log(response);

  res.status(201).json(response);
});
router.get("/", (req, res) => {});
router.get("/:id", (req, res) => {});
router.put("/:id", (req, res) => {});
router.delete("/:id", (req, res) => {});

app.use("/api/v1/cars", router);

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
