import express from "express";
import { addToWatchlist,removeFromWatchlist,updateWatchlistItem,getDataDistributionMovieStatus,getAllWatchlist } from "../controllers/watchlistController.js";
import {authMiddleware} from "../middleware/authMiddleware.js"
import {validateRequest} from "../middleware/validateRequest.js"
import {addToWatchlistSchema} from "../validators/watchlistValidators.js"


/**
 * @swagger
 * /watchlist:
 *   post:
 *     summary: Add movie to watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - movieId
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: "55e5ef18-24ed-4945-b553-9fa0faa8e993"
 *               status:
 *                 type: string
 *                 enum: [PLANNED, WATCHING, COMPLETED, DROPPED]
 *               rating:
 *                 type: integer
 *                 example: 8
 *               notes:
 *                 type: string
 *                 example: "mantap banget"
 *     responses:
 *       201:
 *         description: Success add watchlist
 */


const router = express.Router()

router.use(authMiddleware())

router.post("/",validateRequest(addToWatchlistSchema),addToWatchlist)
router.get("/",getAllWatchlist)

router.get("/status/:movieId",getDataDistributionMovieStatus)
router.put("/:id",updateWatchlistItem)
router.delete("/:id",removeFromWatchlist)

// router.post("/login",login)
// router.delete("/logout",logout)


export default router;