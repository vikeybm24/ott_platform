// Movie type definitions for JSDoc comments

/**
 * @typedef {Object} Movie
 * @property {string} id
 * @property {string} title
 * @property {string} overview
 * @property {string|null} poster_path
 * @property {string|null} backdrop_path
 * @property {string} release_date
 * @property {number} vote_average
 * @property {number} vote_count
 * @property {number|null} [runtime]
 * @property {Genre[]} [genres]
 * @property {string|null} [director]
 * @property {string|null} [actors]
 * @property {string|null} [country]
 * @property {string|null} [language]
 * @property {string|null} [awards]
 */

/**
 * @typedef {Object} Genre
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} MovieResponse
 * @property {Movie[]} results
 */

export {};