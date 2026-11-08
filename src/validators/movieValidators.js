import {z} from "zod";

const addMovieSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title too long"),

  overview: z
    .string()
    .optional(),

  releaseYear: z
    .coerce.number()
    .int("Release year must be integer")
    .min(1900, "Release year too old")
    .max(new Date().getFullYear(), "Release year invalid"),

  genres: z.union([
  z.string(),
  z.array(z.string())
]).optional()
    ,

  // runtime: z
  //   .coerce.number()
  //   .int("Runtime must be integer")
  //   .positive("Runtime must be positive")
  //   .optional()
});

const validateImage = (req, res, next) => {
  const file = req.files?.image;

  if (!file) {
    return res.status(400).json({ msg: "No Files Uploaded" });
  }

  const allowedTypes = [".jpg", ".png", ".jpeg"];
  const ext = file.name.split(".").pop().toLowerCase();

  if (!allowedTypes.includes(`.${ext}`)) {
    return res.status(422).json({ msg: "Invalid Images" });
  }

  if (file.size > 5000000) {
    return res.status(422).json({ msg: "Image Must be Less than 5MB" });
  }

  next();
};

const updateMovieSchema = z.object({
  title: z.string()
    .min(1, "Title cannot be empty")
    .optional(),

  overview: z.string()
    .optional(),

  releaseYear: z.coerce.number()
    .int("Release year must be integer")
    .min(1800, "Release year not valid")
    .max(new Date().getFullYear(), "Release year cannot be in the future")
    .optional(),

  genres: z.string()
    .optional()
    .refine((val) => {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed);
      } catch {
        return false;
      }
    }, {
      message: "Genres must be a valid JSON array"
    }),

  runtime: z.coerce.number()
    .int("Runtime must be integer")
    .positive("Runtime must be positive")
    .optional()
});

export {addMovieSchema,validateImage,updateMovieSchema}