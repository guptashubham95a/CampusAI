import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { Button } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function createData(userId, name, age, role, email, password, flagged) {
  return {
    userId,
    name,
    age,
    role,
    email,
    // password,
    flagged,
  };
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
  },
  {
    id: "userId",
    numeric: true,
    disablePadding: false,
    label: "User ID",
  },
  {
    id: "age",
    numeric: true,
    disablePadding: false,
    label: "Age",
  },
  {
    id: "role",
    numeric: false,
    disablePadding: false,
    label: "Role",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "flagged",
    numeric: false,
    disablePadding: false,
    label: "Flagged",
  },
];
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={
              // add todo toastify
              console.log(`Disabled`)
              // onSelectAllClick
            }
            onClick={
              // add todo toastify
              console.log(`Disabled`)
              // onSelectAllClick
            }
            inputProps={{
              "aria-label": "select all users",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='justify'
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {
  const { numSelected, handleToggleFlagged } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected} selected for Enabling/Disabling the Account.
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant='h6'
          id='tableTitle'
          component='div'
        >
          Users
        </Typography>
      )}
      {/* show delete */}
      {numSelected > 0 ? (
        <Button color='error' onClick={handleToggleFlagged}>
          Enable/Disable
        </Button>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function UserManagementPage({ users, updateUsers }) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const rowsData = [
    ...users.map((user) =>
      createData(
        user.userId,
        user.name,
        user.age,
        user.role,
        user.email,
        user.password,
        user.flagged
      )
    ),
  ];
  const [rows, setRows] = React.useState(rowsData);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.filter((row) => !selected.includes(row.userId));
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleToggleFlagged = () => {
    // Check if all selected rows have the same flagged value
    console.log("Selected Toggle", selected);
    // Get the flagged value of the first selected row
    const firstRowFlagged = rows.find(
      (row) => row.userId === selected[0]
    ).flagged;
    console.log("firstRowFlagged", firstRowFlagged);

    // Check if all selected rows have the same flagged value as the first one
    const allSameFlagged = selected.every(
      (userId) =>
        rows.find((row) => row.userId === userId).flagged === firstRowFlagged
    );
    if (!allSameFlagged) {
      // Show an error message or take appropriate action
      console.log("handleToggleFlagged not same values", allSameFlagged);
      console.log("All does not have same flagged values.");
      // add todo toastify
      // toast.warning("All does not have same flagged values.", {
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: false,
      // });
      return;
    }

    // Update the flagged property of selected rows
    const updatedRows = rows.map((row) =>
      selected.includes(row.userId) ? { ...row, flagged: !row.flagged } : row
    );
    console.log("handleToggleFlagged ", updatedRows);
    console.log(
      `Users Account got successfully ${
        firstRowFlagged ? `disabled` : `enabled`
      }`
    );
    // add todo toastify
    // toast.success(
    //   `Users Account got successfully ${
    //     firstRowFlagged ? `disabled` : `enabled`
    //   }`,
    //   {
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: false,
    //   }
    // );
    setRows(updatedRows);
    // Clear the selection
    updateUsers(!firstRowFlagged, selected);
    setSelected([]);
  };

  const handleClick = (event, userId, userRole) => {
    console.log("handleClick", userId);
    if (userRole === "ADMINISTRATOR") {
      console.log("handleClickDisable", userId, userRole);
      console.log("You can't enable/disable ADMINISTRATOR");

      // toast.warning("You can't enable/disable ADMINISTRATOR", {
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: false,
      // });
      return;
      // add todo toastify
    }
    const selectedIndex = selected.indexOf(userId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, userId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [rows, order, orderBy, page, rowsPerPage]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleToggleFlagged={handleToggleFlagged}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              // onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.userId);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) =>
                      handleClick(event, row.userId, row.role)
                    }
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.userId}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding='checkbox'>
                      <Checkbox
                        color='primary'
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component='th'
                      id={labelId}
                      scope='row'
                      padding='none'
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align='justify'>{row.userId}</TableCell>
                    <TableCell align='justify'>{row.age}</TableCell>
                    <TableCell align='justify'>{row.role}</TableCell>
                    <TableCell align='justify'>{row.email}</TableCell>
                    {/* <TableCell align='justify'>{row.password}</TableCell> */}
                    <TableCell align='justify'>
                      {row.flagged ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label='Dense padding'
      />
      <ToastContainer />
    </Box>
  );
}
