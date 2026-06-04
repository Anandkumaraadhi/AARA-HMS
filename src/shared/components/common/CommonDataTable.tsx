import {
  MaterialReactTable,
  MRT_Row,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";

interface CommonDataTableProps<T extends Record<string, any>> {
  columns: MRT_ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  renderRowActions?: ({
    row,
  }: {
    row: MRT_Row<T>;
  }) => React.ReactNode;
}

function CommonDataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  renderRowActions,
}: CommonDataTableProps<T>) {
  const table = useMaterialReactTable({
    columns,
    data,

    state: {
      isLoading: loading,
    },

    enableRowActions: !!renderRowActions,
    renderRowActions,
    positionActionsColumn: "last",

    enableColumnResizing: true,
    enableColumnPinning: true,
    enableStickyHeader: true,

    initialState: {
      columnPinning: {
        right: ["mrt-row-actions"],
      },
    },

    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "Actions",
        size: 120,
        enablePinning: true,
      },
    },

    muiTableProps: {
      sx: {
        tableLayout: "fixed",
      },
    },

    muiTableHeadCellProps: ({ column }) => ({
      sx:
        column.id === "mrt-row-actions"
          ? {
            position: "sticky",
            right: 0,
            zIndex: 4,
            backgroundColor: "#f9fafb",
            borderLeft: "1px solid #e5e7eb",
          }
          : {},
    }),

    muiTableBodyCellProps: ({ column }) => ({
      sx:
        column.id === "mrt-row-actions"
          ? {
            position: "sticky",
            right: 0,
            zIndex: 2,
            backgroundColor: "#fff",
            borderLeft: "1px solid #e5e7eb",
          }
          : {},
    }),

    muiTableContainerProps: {
      sx: {
        maxWidth: "100%",
        overflowX: "auto",
        overflowY: "auto",
        maxHeight: "60vh",
      },
    },

    muiTablePaperProps: {
      sx: {
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      },
    },
  });

  return <MaterialReactTable table={table} />;
}

export default CommonDataTable;