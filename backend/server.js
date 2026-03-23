import express from "express";
import "dotenv/config";
import { cars } from "./schema.js";
import { eq } from "drizzle-orm";

import db from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();
app.use(express.json());

router.post("/", async (req, res) => {
  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price)
    return res.status(400).json({
      error: "Please provide all the required fields"
    });

  const [newCar] = await db
    .insert(cars)
    .values({ make, model, year, price })
    .returning();

  return res.status(201).json(newCar);
});
router.get("/", async (req, res) => {
  const response = await db.select().from(cars);
  return res.status(200).json(response);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: "Id is required!" });

  const car = await db.select().from(cars).where(eq(cars.id, id));

  if (!car) return res.status(404).json({ error: "Car not found" });

  return res.status(200).json(car);
});
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({
      error: "Id is required!"
    });

  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price)
    return res.status(400).json({
      error: "Please provide all the required fields"
    });

  const [updatedCar] = await db
    .update(cars)
    .set({ make, model, year, price })
    .where(eq(cars.id, id))
    .returning();

  if (Object.keys(updatedCar) == 0)
    return res.status(404).json({ error: "Car not found" });

  return res.status(200).json(updatedCar);
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({
      error: "Id is required!"
    });

  const deletedCar = await db
    .delete(cars)
    .where(eq(cars.id, id))
    .returning({ id: cars.id });
  console.log(deletedCar);

  if (deletedCar == 0) return res.status(404).json({ error: "Car not found" });

  return res.status(200).json({ message: "Car deleted successfully" });
});

app.use("/api/v1/cars", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
