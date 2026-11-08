import { log } from "console";
import { prisma } from "../config/db.js";
import { imagekit } from "../config/imageKit.js";
import path from "path";


const parseGenres = (genres) => {
  if (!genres) return [];

  // kalau array dari form-data
  if (Array.isArray(genres)) {
    return genres.flatMap((g) => g.split(","));
  }

  // kalau string comma separated
  if (typeof genres === "string") {
    return genres.split(",").map((g) => g.trim());
  }

  return [];
};


const addMovie = async (req, res) => {
  const file = req.files?.image;
  const { title, overview, releaseYear, genres, runtime } = req.body;
  const ext = path.extname(file.name);
  
  const result = await imagekit.files.upload({
    file: file.data.toString("base64"),
    fileName: file.name,
    folder: "movies",
  });
  // console.log("ini adalah size nya: ",file.size);

   const parsedGenres = parseGenres(genres);

  const movie = await prisma.movie.create({
    data: {
      title,
      overview,
      genres: parsedGenres,
      releaseYear: Number(releaseYear),
      runtime: runtime ? Number(runtime) : null,
      posterUrl: result.url,
      createdBy: req.user.id,
      fileId: result.fileId,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      movie,
    },
  });
};

const getAllMovie = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany();
    res.status(201).json({
      status: "success",
      data: {
        movies,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

const getAllMoviePagination = async (req, res) => {
  const page = req.query.page || 1
  const limit = req.query.limit || 4
  try {
    const movies = await prisma.movie.findMany({
      skip:(Number(page) - 1) * Number(limit),
      take:Number(limit)
    });
    res.status(201).json({
      status: "success",
      data: {
        movies,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

const getMovie = async (req, res) => {
  try {
    const movies = await prisma.movie.findUnique({
      where : {id:req.params.id}
    });
    res.status(201).json({
      status: "success",
      data: {
        movies,
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};

// const updateMovie = async (req, res) => {
//   const movies = await prisma.movie.findUnique({
//     where: { id: req.params.id },
//   });

//   if (!movies) return res.status(404).json({ msg: "no data found" });
//   let posterUrl = "";
//   let fileId = "";
//   if (req.files == null) {
//     posterUrl = movies.posterUrl;
//     fileId = movies.fileId;
//   } else {
//     const file = req.files?.image;
//     const ext = path.extname(file.name);

//     if (!file) return res.status(400).json({ msg: "No Files Uploaded" });
//     const allowedTypes = [".jpg", ".png", ".jpeg"];
//     if (!allowedTypes.includes(ext.toLowerCase()))
//       return res.status(422).json({ msg: "Invalid Images" });
//     if (file.size > 5000000)
//       return res.status(422).json({ msg: "Image Must be Less than 5MB" });

//     try {
//       const result = await imagekit.files.upload({
//         file: file.data.toString("base64"),
//         fileName: file.name,
//         folder: "movies",
//       });
//       posterUrl = result.url;
//       fileId = result.fileId;
//       const deletedPoster = await imagekit.files.delete(movies.fileId);
//     } catch (error) {
//       console.log(error.message);
//     }
//   }

//   const { title, overview, releaseYear, genres, runtime } = req.body;
//   const movie = await prisma.movie.update({
//     where: { id: req.params.id },
//     data: {
//       title,
//       overview,
//       genres: genres ? JSON.parse(genres) : [],
//       releaseYear: Number(releaseYear),
//       runtime: runtime ? Number(runtime) : null,
//       posterUrl: posterUrl,
//       createdBy: req.user.id,
//       fileId: fileId,
//     },
//   });

//   res.status(201).json({
//     status: "success",
//     data: {
//       movie,
//     },
//   });
// };


const updateMovie = async (req, res) => {
  const movie = await prisma.movie.findUnique({
    where: { id: req.params.id },
  });

  if (!movie) return res.status(404).json({ msg: "No data found" });

  // 🔐 authorization
  if (movie.createdBy !== req.user.id) {
    return res.status(403).json({ msg: "Not authorized" });
  }

  let posterUrl = movie.posterUrl;
  let fileId = movie.fileId;

  const file = req.files?.image;

  if (file) {
    const ext = path.extname(file.name);
    const allowedTypes = [".jpg", ".png", ".jpeg"];

    if (!allowedTypes.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });

    if (file.size > 5000000)
      return res.status(422).json({ msg: "Image must be < 5MB" });

    const result = await imagekit.files.upload({
      file: file.data.toString("base64"),
      fileName: file.name,
      folder: "movies",
    });

    posterUrl = result.url;
    fileId = result.fileId;

    if (movie.fileId) {
      await imagekit.files.delete(movie.fileId);
    }
  }

  const { title, overview, releaseYear, genres, runtime } = req.body;

  const updateData = {};
  const parsedGenres = parseGenres(genres);
  if (title !== undefined) updateData.title = title;
  if (overview !== undefined) updateData.overview = overview;
  if (releaseYear !== undefined) updateData.releaseYear = Number(releaseYear);
  if (runtime !== undefined) updateData.runtime = runtime ? Number(runtime) : null;
  // if (genres !== undefined) updateData.genres = parseGenres(genres)
  
  if (genres !== undefined) {
    try {
      updateData.genres = parsedGenres;
    } catch {
      return res.status(400).json({ msg: "Invalid genres format" });
    }
  }

  updateData.posterUrl = posterUrl;
  updateData.fileId = fileId;

  const updatedMovie = await prisma.movie.update({
    where: { id: req.params.id },
    data: updateData,
  });

  res.status(200).json({
    status: "success",
    data: {
      movie: updatedMovie,
    },
  });
};

const deleteMovie = async (req, res) => {
  try {
    // const id = req.params.id;
    const movie = await prisma.movie.findUnique({
      where: { id :req.params.id },
    });
    if (!movie) {
      res.status(404).json({ message: "Data tidak ditemukan" });
    }
     const deletedPoster = await imagekit.files.delete(movie.fileId);
    await prisma.movie.delete({
      where: { id : req.params.id},
    });
   
    res.status(200).json({ message: "data berhasil dihapus" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllMovieByFilter = async (req, res) => {
  try {
    const title = req.query.title
    const releaseYear = req.query.releaseYear
    const genres = req.query.genres
    let where = {};

    // 🔍 SEARCH (title)
    if (title) {
      where.title = {
        contains: title,
        mode: "insensitive"
      };
    }

    // 🎯 FILTER year
    if (releaseYear) {
      where.releaseYear = Number(releaseYear);
    }

    // 🎯 FILTER genres
    if (genres) {
      const genresArray = genres.split(",");
      where.genres = {
        hasSome: genresArray
      };
    }
    
    const movies = await prisma.movie.findMany({
     where,
     orderBy: {
        createdAt: "desc"
      }
    });
    res.status(201).json({
      status: "success",
      data: {
        movies,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching movies" });
  }
};



export { addMovie, getAllMovie, updateMovie, deleteMovie ,getMovie,getAllMovieByFilter,getAllMoviePagination};
