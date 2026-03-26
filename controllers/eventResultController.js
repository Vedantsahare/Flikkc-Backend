import { distributePrizes } from "../services/prizeDistributionService.js";

export const submitEventResults = async (req, res) => {

  try {

    const { eventId, winners } = req.body;

    await distributePrizes(eventId, winners);

    res.json({
      success: true,
      message: "Prizes distributed"
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};