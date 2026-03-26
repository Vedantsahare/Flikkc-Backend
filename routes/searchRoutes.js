import express from "express";
import { globalSearch } from "../services/searchService.js";

const router = express.Router();

router.get("/", async (req, res) => {

  const { q } = req.query;

  const results = await globalSearch(q);

  res.json({
    success: true,
    results
  });

});

export default router;