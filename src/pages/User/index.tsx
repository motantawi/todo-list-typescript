import { useState, useCallback } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { toast } from "react-toastify";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { changeUserDataSchema } from "../../utils/Schema";
import { requestUpdateUserProfile } from "../../api/auth";
import useUser from "../../hooks/useUser";
import { UpdateUserProfileRequest } from "../../types/userTypes";

const Profile: React.FC = () => {
  const [cantEdit, setCantEdit] = useState<boolean>(true);
  const { user, setUser } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserProfileRequest>({
    resolver: yupResolver(changeUserDataSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  const onSubmit: SubmitHandler<UpdateUserProfileRequest> = useCallback(
    async (formData) => {
      if (!user || !user.id) {
        toast.error("User ID is missing.");
        return;
      }

      try {
        const updatedUserData = await requestUpdateUserProfile(
          user.id,
          formData
        );
        if (updatedUserData) {
          setUser(updatedUserData);
          toast.success("Profile updated successfully");
          setCantEdit(true);
        } else {
          toast.error("Failed to update the profile.");
        }
      } catch (error) {
        console.error("Error updating user profile:", error);
        toast.error("An error occurred while updating the profile.");
      }
    },
    [user, setUser]
  );

  const toggleEdit = useCallback(() => {
    setCantEdit((prevCantEdit) => {
      if (!prevCantEdit) {
        reset();
      }
      return !prevCantEdit;
    });
  }, [reset]);

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 7, mb: 3 }}>
        <Typography variant="h4" color={"primary"} textAlign={"center"}>
          No User Logged In
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 7, mb: 3 }}>
      <Typography variant="h4" color={"primary"} textAlign={"center"}>
        Edit Profile
      </Typography>
      <Button
        type="button"
        color={!cantEdit ? "error" : "primary"}
        onClick={toggleEdit}
        variant="outlined"
        sx={{ mt: 3, width: "100%" }}
      >
        {cantEdit ? "Edit Profile" : "Cancel"}
      </Button>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 2 }}
      >
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          margin="normal"
          disabled={cantEdit}
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message || ""}
        />
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          margin="normal"
          disabled={cantEdit}
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message || ""}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          disabled={cantEdit}
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message || ""}
        />
        <Button
          disabled={cantEdit}
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3, display: cantEdit ? "none" : "block" }}
        >
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
