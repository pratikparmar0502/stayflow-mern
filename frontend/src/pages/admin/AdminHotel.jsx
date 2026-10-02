import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Modal,
  TextField,
  MenuItem,
  useTheme,
  Skeleton,
  useMediaQuery,
} from "@mui/material";

import toast from "react-hot-toast";
import api from "../../api/axios";
import * as Yup from "yup";

const AdminHotel = () => {
  const [list, setList] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Backend server URL.
  // MongoDB stores uploaded images like:
  // /uploads/filename.jpg
  // So React needs to convert that into:
  // http://localhost:5000/uploads/filename.jpg
  const BACKEND_URL = "http://localhost:5000";

  const getImageUrl = (image) => {
    if (!image) return "";

    // Already a complete URL
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // Backend uploaded image
    if (image.startsWith("/uploads/")) {
      return `${BACKEND_URL}${image}`;
    }

    return image;
  };

  // Form validation
  const validationSchema = Yup.object({
    name: Yup.string().required("Hotel name is required"),

    location: Yup.string().required("Location is required"),

    price: Yup.number().positive("Price must be greater than 0").required("Price is required"),

    category: Yup.string().required("Category is required"),
  });

  const initialValues = {
    name: "",
    location: "",
    price: "",
    status: "Available",
    image: null,
    category: "",
  };

  // Fetch hotels when page loads
  useEffect(() => {
    getData();
  }, []);

  // GET /api/hotels
  const getData = async () => {
    try {
      setLoading(true);

      const response = await api.get("/hotels");

      // Our backend returns:
      // {
      //   success: true,
      //   count: ...,
      //   hotels: [...]
      // }
      setList(response.data.hotels || []);
    } catch (error) {
      console.error("GET Hotels Error:", error);

      toast.error(error.response?.data?.message || "Failed to load hotels.");
    } finally {
      setLoading(false);
    }
  };

  // Existing pricing logic preserved.
  const displayPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  // Add / Update hotel
  const handleSubmit = async (values, { resetForm }) => {
    const toastId = toast.loading(editData ? "Updating hotel..." : "Adding hotel...");

    try {
      const formData = new FormData();

      // Normal text fields
      formData.append("name", values.name);
      formData.append("location", values.location);
      formData.append("price", values.price);
      formData.append("status", values.status);
      formData.append("category", values.category);

      // Only append image if a new File was selected.
      // During edit, if the user doesn't select a new image,
      // backend will keep the existing image.
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      if (editData) {
        // PATCH /api/hotels/:id
        await api.patch(`/hotels/${editData._id}`, formData);

        toast.success("Hotel updated successfully!", {
          id: toastId,
        });
      } else {
        // POST /api/hotels
        await api.post("/hotels", formData);

        toast.success("Hotel added successfully!", {
          id: toastId,
        });
      }

      // Reset UI and reload hotels
      finalize(resetForm);
    } catch (error) {
      console.error("Hotel action error:", error);

      toast.error(error.response?.data?.message || "Action failed. Please try again.", {
        id: toastId,
      });
    }
  };

  // Close modal and refresh list
  const finalize = (resetForm) => {
    setEditData(null);
    setOpenModal(false);

    if (resetForm) {
      resetForm();
    }

    getData();
  };

  // Open edit modal
  const handleEdit = (item) => {
    setEditData({
      ...item,
      // Existing image is a string.
      // Formik will show it in preview.
      image: item.image || null,
    });

    setOpenModal(true);
  };

  // Delete hotel
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hotel?")) {
      return;
    }

    try {
      await api.delete(`/hotels/${id}`);

      toast.success("Hotel deleted successfully!");

      getData();
    } catch (error) {
      console.error("Delete hotel error:", error);

      toast.error(error.response?.data?.message || "Failed to delete hotel.");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* PAGE HEADER */}
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        mb={4}
      >
        <Typography variant={isMobile ? "h5" : "h4"} fontWeight={800}>
          Manage Hotels
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          <TextField
            fullWidth={isMobile}
            size="small"
            placeholder="Search Hotels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: "8px",
            }}
          />

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditData(null);
              setOpenModal(true);
            }}
            sx={{
              whiteSpace: "nowrap",
              px: {
                xs: 2,
                md: 3,
              },
            }}
          >
            Add
          </Button>
        </Stack>
      </Stack>

      {/* HOTEL TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Hotel Image</TableCell>

              <TableCell sx={{ fontWeight: 700 }}>Hotel Name</TableCell>

              <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>

              <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>

              <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>

              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* LOADING SKELETON */}
            {loading
              ? [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton
                        variant="rectangular"
                        width={50}
                        height={50}
                        sx={{
                          borderRadius: "10px",
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Skeleton variant="text" width="80%" height={25} />
                    </TableCell>

                    <TableCell>
                      <Skeleton variant="text" width="60%" />
                    </TableCell>

                    <TableCell>
                      <Skeleton variant="text" width="40%" />
                    </TableCell>

                    <TableCell>
                      <Skeleton variant="rounded" width={80} height={25} />
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Skeleton variant="circular" width={30} height={30} />

                        <Skeleton variant="circular" width={30} height={30} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              : list
                  .filter((item) => item.name?.toLowerCase().includes(search.toLowerCase()))
                  .map((row) => (
                    <TableRow key={row._id} hover>
                      {/* IMAGE */}
                      <TableCell>
                        <Box
                          component="img"
                          src={getImageUrl(row.image)}
                          alt={row.name}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "10px",
                            objectFit: "cover",
                          }}
                        />
                      </TableCell>

                      {/* NAME */}
                      <TableCell>
                        <Typography fontWeight={600} variant="body2">
                          {row.name}
                        </Typography>
                      </TableCell>

                      {/* LOCATION */}
                      <TableCell>{row.location}</TableCell>

                      {/* PRICE */}
                      <TableCell sx={{ fontWeight: 700 }}>
                        ₹ {displayPrice(row.price).toLocaleString("en-IN")}
                      </TableCell>

                      {/* CATEGORY */}
                      <TableCell>
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            bgcolor: "#f1f5f9",
                            borderRadius: "12px",
                            display: "inline-block",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {row.category || "N/A"}
                        </Box>
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(row)}
                            sx={{
                              bgcolor: "#e0f2fe",
                              color: "#0284c7",
                              borderRadius: "8px",
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={() => handleDelete(row._id)}
                            sx={{
                              bgcolor: "#fee2e2",
                              color: "#ef4444",
                              borderRadius: "8px",
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ADD / EDIT MODAL */}
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditData(null);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: 450,
            },
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: "24px",
            p: {
              xs: 3,
              md: 4,
            },
            position: "relative",
            outline: "none",
          }}
        >
          <Typography variant="h6" fontWeight={800} mb={3}>
            {editData ? "Edit Hotel Details" : "Register New Hotel"}
          </Typography>

          <Formik
            initialValues={editData || initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values, errors, touched, handleChange }) => (
              <Form>
                <Stack spacing={2.5}>
                  {/* HOTEL NAME */}
                  <Field
                    as={TextField}
                    name="name"
                    label="Hotel Name"
                    fullWidth
                    size="small"
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />

                  {/* LOCATION */}
                  <Field
                    as={TextField}
                    name="location"
                    label="Location"
                    fullWidth
                    size="small"
                    error={touched.location && !!errors.location}
                    helperText={touched.location && errors.location}
                  />

                  {/* PRICE */}
                  <Field
                    as={TextField}
                    name="price"
                    label="Base Price ($)"
                    type="number"
                    fullWidth
                    size="small"
                    helperText="Enter amount in USD. It will be converted to INR (Rate: 1$ = ₹90) for customers."
                    error={touched.price && !!errors.price}
                  />

                  {/* CATEGORY */}
                  <TextField
                    select
                    label="Category (Mood)"
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    error={touched.category && !!errors.category}
                    helperText={touched.category && errors.category}
                  >
                    <MenuItem value="" disabled>
                      Select Mood
                    </MenuItem>

                    {["nature", "urban", "ocean", "romantic", "royal"].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option.toUpperCase()}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* IMAGE UPLOAD */}
                  <Box
                    sx={{
                      border: "2px dashed",
                      borderColor: "#e2e8f0",
                      p: 2,
                      borderRadius: "12px",
                      textAlign: "center",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      id="hotel-img"
                      style={{
                        display: "none",
                      }}
                      onChange={(e) => {
                        const file = e.currentTarget.files?.[0];

                        if (file) {
                          setFieldValue("image", file);
                        }
                      }}
                    />

                    <label htmlFor="hotel-img">
                      <Button component="span" variant="outlined" size="small" sx={{ mb: 1 }}>
                        Upload Image
                      </Button>
                    </label>

                    {/* IMAGE PREVIEW */}
                    {values.image && (
                      <Box mt={1}>
                        <img
                          src={
                            typeof values.image === "string"
                              ? getImageUrl(values.image)
                              : URL.createObjectURL(values.image)
                          }
                          alt="preview"
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  {/* SUBMIT */}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      py: 1.5,
                      borderRadius: "12px",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    {editData ? "Update Hotel" : "Add Hotel"}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminHotel;
