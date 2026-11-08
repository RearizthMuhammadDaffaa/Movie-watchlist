/**
 * @swagger
 * tags:
 *   name: Watchlist
 *   description: Watchlist management API
 */

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

/**
 * @swagger
 * /watchlist:
 *   get:
 *     summary: Get all watchlist for logged in user
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success get watchlist
 */

/**
 * @swagger
 * /watchlist/status/{movieId}:
 *   get:
 *     summary: Get status distribution for a movie
 *     tags: [Watchlist]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *         example: "55e5ef18-24ed-4945-b553-9fa0faa8e993"
 *     responses:
 *       200:
 *         description: Success get distribution
 */

/**
 * @swagger
 * /watchlist/{id}:
 *   put:
 *     summary: Update watchlist item
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "d96cdf01-4931-4ca4-ab6e-e729cbc79419"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PLANNED, WATCHING, COMPLETED, DROPPED]
 *               rating:
 *                 type: integer
 *                 example: 9
 *               notes:
 *                 type: string
 *                 example: "lebih bagus dari sebelumnya"
 *     responses:
 *       200:
 *         description: Success update watchlist
 */

/**
 * @swagger
 * /watchlist/{id}:
 *   delete:
 *     summary: Remove movie from watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "d96cdf01-4931-4ca4-ab6e-e729cbc79419"
 *     responses:
 *       200:
 *         description: Success delete watchlist item
 */