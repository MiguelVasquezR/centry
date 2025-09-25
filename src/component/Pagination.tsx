interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate page numbers to show (max 7 pages visible)
  const getVisiblePages = () => {
    const maxVisible = 7;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <nav
      className="pagination is-centered mt-6 mb-6"
      role="navigation"
      aria-label="pagination"
    >
      {/* Previous Button */}
      <button
        className="pagination-previous"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        title="Página anterior"
      >
        <span className="icon is-small">
          <i className="fas fa-angle-left"></i>
        </span>
        <span>Anterior</span>
      </button>

      {/* Next Button */}
      <button
        className="pagination-next"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        title="Página siguiente"
      >
        <span>Siguiente</span>
        <span className="icon is-small">
          <i className="fas fa-angle-right"></i>
        </span>
      </button>

      {/* Page Numbers */}
      <ul className="pagination-list">
        {/* First page */}
        {visiblePages[0] > 1 && (
          <>
            <li>
              <button
                className="pagination-link"
                onClick={() => onPageChange(1)}
                aria-label="Ir a la página 1"
              >
                1
              </button>
            </li>
            {visiblePages[0] > 2 && (
              <li>
                <span className="pagination-ellipsis">&hellip;</span>
              </li>
            )}
          </>
        )}

        {/* Visible page numbers */}
        {visiblePages.map((page) => (
          <li key={page}>
            <button
              className={`pagination-link ${
                currentPage === page ? "is-current" : ""
              }`}
              onClick={() => onPageChange(page)}
              aria-label={`${
                currentPage === page ? "Página " : "Ir a la página "
              }${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Last page */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <li>
                <span className="pagination-ellipsis">&hellip;</span>
              </li>
            )}
            <li>
              <button
                className="pagination-link"
                onClick={() => onPageChange(totalPages)}
                aria-label={`Ir a la página ${totalPages}`}
              >
                {totalPages}
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
