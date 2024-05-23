import { useState, useMemo, useEffect, useRef } from "react";
import Loader from "../Loader";
import "./index.scss";

const Table = ({
  title,
  columns,
  data,
  total,
  customElement = null,
  getCurrentPage,
  loading = false,
  pagination = false,
  loadMoreData = () => {},
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = useMemo(() => {
    return Math.ceil(total / data?.length);
  }, []);
  const inputRef = useRef(null);

  useEffect(() => {
    if (getCurrentPage && typeof getCurrentPage === "function") {
      getCurrentPage(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
    };

    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const changePage = (value) => {
    setCurrentPage(value);
  };
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      setCurrentPage(1);
    }
  };

  return (
    <div className="bg-white flex items-center justify-center pt-10 pb-14 table-container">
      <div className="w-full px-2">
        <div>
          <h1 className="text-2xl font-medium">{title}</h1>
          {customElement}
        </div>

        <div className="w-full overflow-x-scroll md:overflow-auto  max-w-7xl 2xl:max-w-none">
          <table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border ">
            <thead
              className={`rounded-lg text-base text-white font-semibold w-full `}
            >
              <tr className="bg-[#222E3A]/[6%] border-x-2 border-t-2 border-black">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap group min-w-[156px]"
                  >
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="border-x-2 border-black border-b-2">
              {data.map((row, rowIndex) => (
                <tr key={row?.id || rowIndex}>
                  {columns.map((column) => (
                    <td
                      className={`py-2 px-3 font-normal text-base ${"border-t-2 border-black"} whitespace-nowrap`}
                      key={column.key}
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
              {loading && (
                <tr className="loader-row">
                  <td className="loader-cell" colspan={`${columns.length}`}>
                    <Loader />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination ? (
          <div
            className={`table-pagination w-full justify-center sm:justify-between flex-col sm:flex-row gap-5 mt-2.5 px-1 items-center ${
              total > 0 ? "flex" : "hidden"
            }`}
          >
            <div className="text-lg">
              Showing {currentPage * data?.length + 1 - data?.length} to{" "}
              {currentPage == totalPage ? total : currentPage * data?.length} of{" "}
              {total} entries
            </div>
            <div className="flex">
              <ul
                className="flex justify-center items-center gap-x-[10px] z-30"
                role="navigation"
                aria-label="Pagination"
              >
                <li
                  className={`prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] disabled] ${
                    currentPage == 1
                      ? "bg-[#cccccc] pointer-events-none"
                      : " cursor-pointer"
                  }`}
                  onClick={() => setCurrentPage(1)}
                >
                  <img src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg" />
                  <img src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg" />
                </li>

                <li
                  className={`prev-btn flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] disabled] ${
                    currentPage == 1
                      ? "bg-[#cccccc] pointer-events-none"
                      : " cursor-pointer"
                  }`}
                  onClick={previousPage}
                >
                  <img src="https://www.tailwindtap.com/assets/travelagency-admin/leftarrow.svg" />
                </li>

                <input
                  type="number"
                  ref={inputRef}
                  className={`text-center w-[36px] rounded-[6px] h-[34px] border-solid border-[2px] bg-[#FFFFFF] cursor-pointer `}
                  value={currentPage}
                  onChange={(e) => {
                    const newPage = parseInt(e.target.value, 10);
                    changePage(newPage);
                    setTimeout(() => {
                      if (newPage <= 0 || newPage > totalPage) {
                        changePage(1);
                      }
                    }, 1000);
                  }}
                />

                <li
                  className={`flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${
                    currentPage == totalPage
                      ? "bg-[#cccccc] pointer-events-none"
                      : " cursor-pointer"
                  }`}
                  onClick={nextPage}
                >
                  <img src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg" />
                </li>

                <li
                  className={`flex items-center justify-center w-[36px] rounded-[6px] h-[36px] border-[1px] border-solid border-[#E4E4EB] ${
                    currentPage == totalPage
                      ? "bg-[#cccccc] pointer-events-none"
                      : " cursor-pointer"
                  }`}
                  onClick={() => setCurrentPage(totalPage)}
                >
                  <img src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg" />
                  <img src="https://www.tailwindtap.com/assets/travelagency-admin/rightarrow.svg" />
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 w-full border-b-2 border-x-2 border-black disabled:bg-blue-400"
            onClick={loadMoreData}
            disabled={loading}
          >
            View More
          </button>
        )}
      </div>
    </div>
  );
};

export default Table;
