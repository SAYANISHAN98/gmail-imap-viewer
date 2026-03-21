import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ currentPage, totalPages, onPageChange, disabled }) {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1 && !disabled) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages && !disabled) onPageChange(currentPage + 1);
  };

  // Build an array of up to 5 page numbers centred around currentPage
  const getPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    // Adjust if at the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="px-4 py-3 flex items-center justify-between sm:px-6">
      {/* Mobile */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1 || disabled}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 self-center">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || disabled}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
        <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            disabled={currentPage === 1 || disabled}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* First page + ellipsis */}
          {pageNumbers[0] > 1 && (
            <>
              <button onClick={() => onPageChange(1)} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">1</button>
              {pageNumbers[0] > 2 && <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">…</span>}
            </>
          )}

          {/* Visible page numbers */}
          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              disabled={disabled}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                num === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {num}
            </button>
          ))}

          {/* Last page + ellipsis */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">…</span>}
              <button onClick={() => onPageChange(totalPages)} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">{totalPages}</button>
            </>
          )}

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages || disabled}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Pagination;
