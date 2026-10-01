import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../api/axios";

const BACKEND_URL = "http://localhost:5000";

const Bookings = () => {
  const history = useHistory();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Convert backend relative image paths
  // like /uploads/hotel.jpg into a complete URL.
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

  // Fetch only the logged-in user's bookings
  const fetchMyBookings = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // User must be logged in
      if (!token) {
        toast.error("Please login to view your bookings.");
        history.push("/login");
        return;
      }

      const response = await api.get("/bookings/my");

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);

      const message = error.response?.data?.message || "Failed to load your bookings.";

      toast.error(message);

      // If JWT is invalid/expired, send user to login
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");

        history.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format amount
  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // Status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "success";

      case "cancelled":
        return "error";

      case "completed":
        return "info";

      case "pending":
      default:
        return "warning";
    }
  };

  // Loading state
  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        My Bookings
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View and manage your StayFlow hotel bookings.
      </Typography>

      {/* No bookings */}
      {bookings.length === 0 ? (
        <Card sx={{ p: 5, textAlign: "center" }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            No bookings found
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            You haven't made any hotel bookings yet.
          </Typography>

          <Button variant="contained" onClick={() => history.push("/")}>
            Explore Hotels
          </Button>
        </Card>
      ) : (
        <Stack spacing={3}>
          {bookings.map((booking) => (
            <Card
              key={booking._id}
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  md: "row",
                },
                overflow: "hidden",
              }}
            >
              {/* Hotel Image */}
              {booking.hotelImage && (
                <CardMedia
                  component="img"
                  sx={{
                    width: {
                      xs: "100%",
                      md: 280,
                    },
                    height: {
                      xs: 220,
                      md: "auto",
                    },
                    objectFit: "cover",
                  }}
                  image={getImageUrl(booking.hotelImage)}
                  alt={booking.hotelName}
                />
              )}

              {/* Booking Information */}
              <CardContent sx={{ flex: 1, p: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {booking.hotelName}
                    </Typography>

                    {booking.hotel?.location && (
                      <Typography variant="body2" color="text.secondary">
                        {booking.hotel.location}
                      </Typography>
                    )}
                  </Box>

                  <Chip
                    label={booking.status ? booking.status.toUpperCase() : "PENDING"}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1.5} sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Guest
                    </Typography>

                    <Typography variant="body1">{booking.customerName || "Guest"}</Typography>
                  </Box>

                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={{
                      xs: 1,
                      sm: 5,
                    }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Check-in
                      </Typography>

                      <Typography variant="body1">{formatDate(booking.checkIn)}</Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Check-out
                      </Typography>

                      <Typography variant="body1">{formatDate(booking.checkOut)}</Typography>
                    </Box>
                  </Stack>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Amount
                    </Typography>

                    <Typography variant="h6" fontWeight="bold">
                      {formatAmount(booking.amount)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Payment
                    </Typography>

                    <Chip
                      label={
                        booking.paymentStatus ? booking.paymentStatus.toUpperCase() : "PENDING"
                      }
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default Bookings;
