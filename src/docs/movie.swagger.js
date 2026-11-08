/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management API
 */

/**
 * @swagger
 * /movies:
 *   post:
 *     summary: Create new movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - releaseYear
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Godfather
 *               overview:
 *                 type: string
 *                 example: Story about mafia family
 *               releaseYear:
 *                 type: integer
 *                 example: 1972
 *               genres:
 *                 type: string
 *                 example: Drama
 *               runtime:
 *                 type: integer
 *                 example: 175
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Movie created successfully
 */

/**
 * @swagger
 * /movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Success get all movies
 */

/**
 * @swagger
 * /movies/pagination:
 *   get:
 *     summary: Get movies with pagination
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 4
 *     responses:
 *       200:
 *         description: Success get paginated movies
 */

/**
 * @swagger
 * /movies/filter:
 *   get:
 *     summary: Search and filter movies
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         example: "godfather"
 *       - in: query
 *         name: releaseYear
 *         schema:
 *           type: integer
 *         example: 1972
 *       - in: query
 *         name: genres
 *         schema:
 *           type: string
 *         example: "Crime,Drama"
 *     responses:
 *       200:
 *         description: Success filter movies
 */

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "55e5ef18-24ed-4945-b553-9fa0faa8e993"
 *     responses:
 *       200:
 *         description: Success get movie
 */

/**
 * @swagger
 * /movies/{id}:
 *   put:
 *     summary: Update movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               overview:
 *                 type: string
 *               releaseYear:
 *                 type: integer
 *               genres:
 *                 type: string
 *                 example: Drama
 *               runtime:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Movie updated successfully
 */

/**
 * @swagger
 * /movies/{id}:
 *   delete:
 *     summary: Delete movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 */