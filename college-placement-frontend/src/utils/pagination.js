/**
 * Returns pagination metadata for a given page/size.
 * @param {number} page - 0-indexed page number
 * @param {number} size - page size
 * @param {number} totalElements - total record count
 */
export const getPaginationMeta = (page, size, totalElements) => {
  const totalPages = Math.ceil(totalElements / size);
  return {
    page,
    size,
    totalElements,
    totalPages,
    isFirst: page === 0,
    isLast: page >= totalPages - 1,
    from: totalElements === 0 ? 0 : page * size + 1,
    to: Math.min((page + 1) * size, totalElements),
  };
};

/**
 * Build Spring Boot pageable query params.
 * @param {number} page - 0-indexed
 * @param {number} size
 * @param {string} sort - e.g. "createdAt,desc"
 */
export const buildPageParams = (page = 0, size = 10, sort = "createdAt,desc") => ({
  page,
  size,
  sort,
});
