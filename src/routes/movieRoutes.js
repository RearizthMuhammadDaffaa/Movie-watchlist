import express from "express";
import { addToWatchlist,removeFromWatchlist,updateWatchlistItem } from "../controllers/watchlistController.js";
import {authMiddleware} from "../middleware/authMiddleware.js"
import {validateRequest} from "../middleware/validateRequest.js"
import {addMovieSchema , validateImage,updateMovieSchema} from "../validators/movieValidators.js"
import { addMovie,getAllMovie,updateMovie,deleteMovie, getMovie, getAllMovieByFilter, getAllMoviePagination } from "../controllers/movieController.js";
const router = express.Router()

// router.use(authMiddleware)

router.post("/",validateImage,authMiddleware(['ADMIN']),addMovie)
router.get("/",getAllMovie)
router.get("/pagination",getAllMoviePagination)
router.get("/filter",getAllMovieByFilter)
router.get("/:id",getMovie)
router.put("/:id",validateRequest(addMovieSchema),authMiddleware(['ADMIN']),updateMovie)
router.delete("/:id",authMiddleware(['ADMIN']),deleteMovie)


export default router;