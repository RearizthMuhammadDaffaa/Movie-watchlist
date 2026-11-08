import { prisma } from "../config/db.js";


const addToWatchlist = async (req,res) => {
  const {movieId,status,rating,notes,userId} = req.body;

  // verify movie exist
  const movie = await prisma.movie.findUnique({
    where: {id:movieId}
  })

  if (!movie) {
    return res.status(404).json({error: "Movie not found"})
  }

  // check if alread added
  const existingInWatchlist = await prisma.watchlistItem.findUnique({
    where : {
      userId_movieId : {
            userId: req.user.id,
            movieId:movieId
    }}
  });

  if (existingInWatchlist) {
    return res.status(400).json({error: "Movie already in the wathclist"})
  }


 const parsedRating = rating !== undefined ? Number(rating) : null;

let newAvg = movie.avgRating;
let newCount = movie.ratingCount;

if (parsedRating !== null) {
  newCount += 1;
  newAvg =
    ((movie.avgRating * movie.ratingCount) + parsedRating) / newCount;
}
  // 🔥 update rating movie jika ada rating

  const [watchlistItem] = await prisma.$transaction([
  prisma.watchlistItem.create({
    data : {
        userId : req.user.id,
        movieId,
        status:status || "PLANNED",
        rating:parsedRating,
        notes
    }
  }),
      prisma.movie.update({
      where: { id: movieId },
      data: {
        avgRating: newAvg,
        ratingCount: newCount,
      },
    })
  ])  
  

  res.status(201).json({
    status:"success",
    data : {
        watchlistItem
    }
  })

}


/**
 * Update watchlist item
 * Updates status, rating, or notes
 * Ensures only owner can update
 * Requires protect middleware
 */
const updateWatchlistItem = async (req, res) => {
  const { status, rating, notes } = req.body;

  // Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }
  
   const movie = await prisma.movie.findUnique({
    where : {id : watchlistItem.movieId}
  });

  if (!movie) {
    return res.status(404).json({error: "Movie not found"})
  }


  // Ensure only owner can update
  if (watchlistItem.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "Not allowed to update this watchlist item" });
  }

  // Build update data
  const updateData = {};
  if (status !== undefined) updateData.status = status.toUpperCase();
  if (rating !== undefined) updateData.rating = rating;
  if (notes !== undefined) updateData.notes = notes;

let newAvg = movie.avgRating; // 9
let count = movie.ratingCount;

if (rating !== undefined) {
  const newRating = Number(rating); // 8

  if (watchlistItem.rating !== null) {
    // 🔥 UPDATE rating
    newAvg = ((movie.avgRating * count) - watchlistItem.rating + newRating) / count;
    
  } else {
    // 🔥 TAMBAH rating baru
    const newCount = count + 1;
    newAvg =
      ((movie.avgRating * count) + newRating) / newCount;
    count = newCount;
  }
}

  // Update watchlist item
  await prisma.$transaction([
  prisma.watchlistItem.update({
    where: { id: req.params.id },
    data: updateData,
  }),

  prisma.movie.update({
    where: { id: watchlistItem.movieId },
    data: {
      avgRating: newAvg,
      ratingCount: movie.ratingCount,
    },
  })
])
   
  res.status(200).json({
    status: "success",
    data: {
      watchlistItem: updateData,
    },
  });
};

/**
 * Remove movie from watchlist
 * Deletes watchlist item
 * Ensures only owner can delete
 * Requires protect middleware
 */
const removeFromWatchlist = async (req, res) => {
  // Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  });

  const movie = await prisma.movie.findUnique({
    where : {id : watchlistItem.movieId}
  });

  if (!movie) {
    return res.status(404).json({error: "Movie not found"})
  }

  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  // Ensure only owner can delete
  if (watchlistItem.userId !== req.user.id) {
    return res
      .status(403)
      .json({ error: "Not allowed to update this watchlist item" });
  }

  if (movie.ratingCount == 0 || movie.ratingCount <= 0){
     return res
      .status(403)
      .json({ error: "Not allowed to Delete this watchlist item" });
  }

  let count = movie.ratingCount
  let newAvg = ((movie.avgRating * movie.ratingCount) - watchlistItem.rating) / count;
  const newCount = movie.ratingCount - 1;
  if (watchlistItem.rating !== null) {
  
    if (newCount === 0) {
      newAvg = 0;
      count = 0;
    } else {
      newAvg = ((movie.avgRating * count) - watchlistItem.rating) / newCount;
      count = newCount;
    }
  }

  await prisma.$transaction([
     prisma.watchlistItem.delete({
    where: { id: req.params.id },
  }),

    prisma.movie.update({
      where: { id: watchlistItem.movieId },
      data: {
        avgRating: newAvg,
        ratingCount: newCount,
      },
    })
  ])
      
  res.status(200).json({
    status: "success",
    message: "Movie removed from watchlist",
  });
};

const getDataDistributionMovieStatus = async (req,res) => {
   const { movieId } = req.params;

  try {
    const result = await prisma.watchlistItem.groupBy({
      by: ["status"],
      where: {
        movieId: movieId,
      },
      _count: {
        status: true,
      },
    });

    // format biar rapi
    const formatted = {
      PLANNED: 0,
      WATCHING: 0,
      COMPLETED: 0,
      DROPPED: 0,
    };

    result.forEach((item) => {
      formatted[item.status] = item._count.status;
    });

    res.json({
      status: "success",
      data: formatted,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server error" });
  }
}

const getAllWatchlist = async (req,res) => {
  try {

      const movie = await prisma.watchlistItem.findMany({
        where : {userId : req.user.id}
      });
      res.status(200).json({
        message: "Success",
        movie
      })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Server error" });
  }
}



export { addToWatchlist, updateWatchlistItem, removeFromWatchlist,getDataDistributionMovieStatus,getAllWatchlist };