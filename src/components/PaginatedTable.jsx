import { useEffect, useState } from "react";
import { FaCheck, FaPencilAlt, FaRegTimesCircle, FaRegTrashAlt } from "react-icons/fa";
import "./PaginatedTable.scss";

const PaginatedTable = ({ columns, data, pageSize, onEdit, onDelete, onViewMore, onDownload, onTraining }) => {
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, data]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const currentPageDisplay = totalPages > 0 ? currentPage : 0;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const renderCellContent = (item, column) => {
    const value = item[column.accessor];

    if (column.Cell) {
      return column.Cell({ value });
    }

    if (typeof value === "boolean") {
      return value ? <FaCheck className="text-green-500" /> : <FaRegTimesCircle className="text-red-500" />;
    }

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    return value !== undefined && value !== null ? value.toString() : null;
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="paginated-table-container">
      <input
        type="text"
        placeholder="Filtrar..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="paginated-table-filter"
      />
      <div className="paginated-table-wrapper">
        <table className="paginated-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  style={{ width: column.width || 'auto', maxWidth: column.width, wordWrap: 'break-word'}}
                >
                  {column.Header}
                </th>
              ))}
              {(onEdit || onDelete || onViewMore || onDownload || onTraining) && (
                <th className="paginated-table-actions-header">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td
                    key={column.id}
                    style={{ width: column.width || 'auto', maxWidth: column.width, wordWrap: 'break-word'}}
                  >
                    {renderCellContent(item, column)}
                  </td>
                ))}
                {(onEdit || onDelete || onViewMore || onDownload || onTraining) && (
                  <td>
                    <div className="paginated-table-actions">
                      {onViewMore && (
                        <button
                          className="paginated-table-action-button view-more"
                          onClick={() => onViewMore(item)}
                        >
                          Ver más
                        </button>
                      )}
                      {onEdit && (
                        <button
                          className="paginated-table-action-button edit"
                          onClick={() => onEdit(item)}
                        >
                          <FaPencilAlt />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="paginated-table-action-button delete"
                          onClick={() => onDelete(item)}
                        >
                          <FaRegTrashAlt />
                        </button>
                      )}
                      {onTraining && (
                        <button
                          className="paginated-table-action-button training"
                          onClick={() => onTraining(item)}
                        >
                          Entrenar
                        </button>
                      )}
                      {onDownload && item.originalFile && (
                        <button
                          className="paginated-table-action-button download"
                          onClick={() => onDownload(item)}
                        >
                          Descargar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="paginated-table-pagination">
          <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>
            Página {currentPageDisplay} de {totalPages > 0 ? totalPages : 0}
          </span>
          <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginatedTable;