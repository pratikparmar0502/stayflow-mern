import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  Stack,
  Button,
  Avatar,
  Grid,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  CheckCircle,
  Cancel,
  Assessment,
  PendingActions,
  VerifiedUser,
  DoDisturbOn,
  DeleteForever,
  ImageNotSupported,
} from "@mui/icons-material";

import api from "../../api/axios";
import toast from "react-hot-toast";

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tabValue, setTabValue] = useState("all");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Backend URL used for uploaded hotel images.
  const BACKEND_URL = "http://localhost:5000";

  /*
   * Convert backend image paths into usable browser URLs.
   *
   * Example:
   *
   * /uploads/hotel.jpg
   *
   * becomes:
   *
   * http://localhost:5000/uploads/hotel.jpg
   */
  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    if (image.startsWith("/uploads/")) {
      return `${BACKEND_URL}${image}`;
    }

    return image;
  };

  /*
   * Fetch all bookings.
   *
   * New backend:
   * GET /api/bookings
   *
   * This route is protected and admin-only.
   * Axios automatically sends the JWT token.
   */
  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await api.get("/bookings");

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Booking fetch error:", error);

      const message = error.response?.data?.message || "Failed to load bookings.";

      toast.error(message);

      /*
       * If the JWT is invalid/expired,
       * clear authentication data and send
       * the user back to login.
       */
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /*
   * Booking statistics
   */
  const stats = {
    total: bookings.length,

    pending: bookings.filter(
      (booking) => (booking.status?.toLowerCase() || "pending") === "pending",
    ).length,

    confirmed: bookings.filter((booking) => booking.status?.toLowerCase() === "confirmed").length,

    cancelled: bookings.filter((booking) => booking.status?.toLowerCase() === "cancelled").length,
  };

  /*
   * Delete booking
   *
   * New backend:
   * DELETE /api/bookings/:id
   */
  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) {
      return;
    }

    const toastId = toast.loading("Deleting...");

    try {
      await api.delete(`/bookings/${id}`);

      toast.success("Booking deleted successfully!", {
        id: toastId,
      });

      fetchData();
    } catch (error) {
      console.error("Delete booking error:", error);

      toast.error(error.response?.data?.message || "Delete failed.", {
        id: toastId,
      });
    }
  };

  /*
   * Update booking status.
   *
   * New backend accepts JSON, so we no longer need
   * to download the hotel image and rebuild FormData.
   *
   * PATCH /api/bookings/:id
   */
  const updateStatus = async (id, newStatus) => {
    const toastId = toast.loading(`Updating to ${newStatus}...`);

    try {
      await api.patch(`/bookings/${id}`, {
        status: newStatus.toLowerCase(),
      });

      toast.success("Booking updated successfully!", {
        id: toastId,
      });

      fetchData();
    } catch (error) {
      console.error("Update booking error:", error);

      toast.error(error.response?.data?.message || "Update failed.", {
        id: toastId,
      });
    }
  };

  /*
   * Filter bookings by:
   *
   * 1. Status tab
   * 2. Check-in date range
   */
  const filteredBookings = bookings.filter((booking) => {
    const bookingStatus = booking.status?.toLowerCase() || "pending";

    // Status filter
    if (tabValue !== "all" && bookingStatus !== tabValue) {
      return false;
    }

    // Date filter
    if (startDate || endDate) {
      const bookingDate = new Date(booking.checkIn).getTime();

      if (startDate) {
        const start = new Date(startDate).getTime();

        if (bookingDate < start) {
          return false;
        }
      }

      if (endDate) {
        /*
         * Add one day so the selected end date
         * is included in the filter.
         */
        const endDateObj = new Date(endDate);

        endDateObj.setHours(23, 59, 59, 999);

        const end = endDateObj.getTime();

        if (bookingDate > end) {
          return false;
        }
      }
    }

    return true;
  });

  /*
   * Format date for display
   */
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /*
   * Format booking amount.
   *
   * Existing project pricing logic is preserved:
   * backend amount × 90
   */
  const displayAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  /*
   * Loading screen
   */
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: {
          xs: 1,
          sm: 3,
        },
        bgcolor: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      {/* PAGE TITLE */}
      <Typography variant={isMobile ? "h5" : "h4"} fontWeight={900} mb={4} color="#1e293b">
        Bookings Management
      </Typography>

      {/* STATS CARDS */}
      <Grid container spacing={2} mb={4}>
        {[
          {
            label: "Total",
            val: stats.total,
            col: "#6366f1",
            icon: <Assessment />,
          },
          {
            label: "Pending",
            val: stats.pending,
            col: "#f59e0b",
            icon: <PendingActions />,
          },
          {
            label: "Confirmed",
            val: stats.confirmed,
            col: "#10b981",
            icon: <VerifiedUser />,
          },
          {
            label: "Cancelled",
            val: stats.cancelled,
            col: "#ef4444",
            icon: <DoDisturbOn />,
          },
        ].map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Paper
              sx={{
                p: 2,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: `${stat.col}15`,
                  color: stat.col,
                  width: 40,
                  height: 40,
                }}
              >
                {stat.icon}
              </Avatar>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    lineHeight: 1,
                  }}
                >
                  {stat.label}
                </Typography>

                <Typography variant="h6" fontWeight={800}>
                  {stat.val}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* FILTERS & TABS */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{
            xs: "stretch",
            lg: "center",
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(event, value) => setTabValue(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: {
                xs: 1,
                lg: 0,
              },
              borderColor: "divider",
            }}
          >
            <Tab label="All" value="all" />

            <Tab label="Pending" value="pending" />

            <Tab label="Confirmed" value="confirmed" />

            <Tab label="Cancelled" value="cancelled" />
          </Tabs>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <TextField
              type="date"
              label="From"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              fullWidth
            />

            <TextField
              type="date"
              label="To"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              fullWidth
            />

            <Button
              variant="outlined"
              color="inherit"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              sx={{
                borderRadius: 2,
              }}
            >
              Clear
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* BOOKINGS TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          overflowX: "auto",
        }}
      >
        <Table
          sx={{
            minWidth: 900,
          }}
        >
          <TableHead
            sx={{
              bgcolor: "#f8fafc",
            }}
          >
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Hotel
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Customer
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Dates
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Amount
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Status
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{
                    py: 6,
                  }}
                >
                  <Typography color="text.secondary">No bookings found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((row) => (
                <TableRow key={row._id} hover>
                  {/* HOTEL */}
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        variant="rounded"
                        src={getImageUrl(row.hotelImage)}
                        sx={{
                          width: 60,
                          height: 45,
                          bgcolor: "#f1f5f9",
                        }}
                      >
                        <ImageNotSupported />
                      </Avatar>

                      <Typography variant="body2" fontWeight={700}>
                        {row.hotelName}
                      </Typography>
                    </Stack>
                  </TableCell>

                  {/* CUSTOMER */}
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {row.customerName || "Guest"}
                    </Typography>

                    {row.user?.email && (
                      <Typography variant="caption" color="text.secondary">
                        {row.user.email}
                      </Typography>
                    )}
                  </TableCell>

                  {/* DATES */}
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "#475569",
                      }}
                    >
                      {formatDate(row.checkIn)} — {formatDate(row.checkOut)}
                    </Typography>
                  </TableCell>

                  {/* AMOUNT */}
                  <TableCell>
                    <Typography variant="body2" fontWeight={800}>
                      ₹ {displayAmount(row.amount)}
                    </Typography>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <Chip
                      label={row.status || "pending"}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: "10px",
                      }}
                      color={
                        row.status === "confirmed"
                          ? "success"
                          : row.status === "cancelled"
                            ? "error"
                            : "warning"
                      }
                    />
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      {/* CONFIRM */}
                      <Tooltip title="Confirm">
                        <IconButton
                          size="small"
                          onClick={() => updateStatus(row._id, "confirmed")}
                          color="success"
                          disabled={row.status === "confirmed"}
                        >
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* CANCEL */}
                      <Tooltip title="Cancel">
                        <IconButton
                          size="small"
                          onClick={() => updateStatus(row._id, "cancelled")}
                          color="warning"
                          disabled={row.status === "cancelled"}
                        >
                          <Cancel fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {/* DELETE */}
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => deleteBooking(row._id)}
                          color="error"
                        >
                          <DeleteForever fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminBooking;
