import { Router } from "express";
import categoryRoutes from "./categoryRoutes";

const router = Router();

router.use("/category", categoryRoutes);

export default router;
