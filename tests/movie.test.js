import {
  addMovie,
  getAllMovie,
  getMovie,
  updateMovie,
  deleteMovie,
  getAllMoviePagination,
  getAllMovieByFilter
} from "../src/controllers/movieController.js";

import { prisma } from "../src/config/db.js";
import { imagekit } from "../src/config/imageKit.js";

jest.mock("../src/config/db.js", () => ({
  prisma: {
    movie: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("../src/config/imageKit.js", () => ({
  imagekit: {
    files: {
      upload: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("Movie Controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // ADD MOVIE
  // =========================
  describe("addMovie", () => {

    test("should create movie successfully", async () => {

      const req = {
        body: {
          title: "The Godfather swager sadsa",
          overview: "Best mafia movie",
          releaseYear: 1972,
          genres: "Drama,Crime",
          runtime: 175,
        },
        files: {
          image: {
            name: "movie.jpg",
            data: Buffer.from("test"),
          },
        },
        user: {
          id: "e638d547-b2c8-48f2-bf39-6ba4427914cf",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      imagekit.files.upload.mockResolvedValue({
        url: "image-url",
        fileId: "file-123",
      });

      prisma.movie.create.mockResolvedValue({
        id: "movie-123",
        title: "The Godfather",
      });

      await addMovie(req, res);

      expect(imagekit.files.upload).toHaveBeenCalled();

      expect(prisma.movie.create).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  // =========================
  // GET ALL MOVIES
  // =========================
  describe("getAllMovie", () => {

    test("should return all movies", async () => {

      const req = {};

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      prisma.movie.findMany.mockResolvedValue([
        { title: "Movie 1" },
        { title: "Movie 2" },
      ]);

      await getAllMovie(req, res);

      expect(prisma.movie.findMany).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  // =========================
  // GET MOVIE BY ID
  // =========================
  describe("getMovie", () => {

    test("should get movie by id", async () => {

      const req = {
        params: {
          id: "movie-123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      prisma.movie.findUnique.mockResolvedValue({
        id: "movie-123",
        title: "The Godfather",
      });

      await getMovie(req, res);

      expect(prisma.movie.findUnique).toHaveBeenCalledWith({
        where: { id: "movie-123" },
      });

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  // =========================
  // UPDATE MOVIE
  // =========================
  describe("updateMovie", () => {

    test("should update movie successfully", async () => {

      const req = {
        params: {
          id: "movie-123",
        },
        body: {
          title: "Updated Movie",
          genres: "Action,Drama",
        },
        files: {},
        user: {
          id: "user-123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      prisma.movie.findUnique.mockResolvedValue({
        id: "movie-123",
        createdBy: "user-123",
        posterUrl: "old.jpg",
        fileId: "old-file",
      });

      prisma.movie.update.mockResolvedValue({
        title: "Updated Movie",
      });

      await updateMovie(req, res);

      expect(prisma.movie.update).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
    });

    test("should return 403 if not authorized", async () => {

      const req = {
        params: {
          id: "movie-123",
        },
        body: {},
        user: {
          id: "another-user",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      prisma.movie.findUnique.mockResolvedValue({
        id: "movie-123",
        createdBy: "owner-user",
      });

      await updateMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  // =========================
  // DELETE MOVIE
  // =========================
  describe("deleteMovie", () => {

    test("should delete movie successfully", async () => {

      const req = {
        params: {
          id: "movie-123",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      prisma.movie.findUnique.mockResolvedValue({
        id: "movie-123",
        fileId: "file-123",
      });

      prisma.movie.delete.mockResolvedValue({});

      imagekit.files.delete.mockResolvedValue({});

      await deleteMovie(req, res);

      expect(prisma.movie.delete).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // =========================
  // PAGINATION
  // =========================
  describe("getAllMoviePagination", () => {

    test("should return paginated movies", async () => {

      const req = {
        query: {
          page: 1,
          limit: 2,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      prisma.movie.findMany.mockResolvedValue([
        { title: "Movie 1" },
        { title: "Movie 2" },
      ]);

      await getAllMoviePagination(req, res);

      expect(prisma.movie.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 2,
      });

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  // =========================
  // FILTER MOVIES
  // =========================
  describe("getAllMovieByFilter", () => {

    test("should filter movies", async () => {

      const req = {
        query: {
          title: "godfather",
          genres: "Drama",
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      prisma.movie.findMany.mockResolvedValue([
        { title: "The Godfather" },
      ]);

      await getAllMovieByFilter(req, res);

      expect(prisma.movie.findMany).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

});