import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useMutation } from "@apollo/client";
import { FaBug } from "react-icons/fa";
import { ArrowLeft } from "@strapi/icons";
import { Navigate } from "react-router-dom";
import { Link } from "@strapi/design-system/Link";
import { IconWrapper } from "../../styled/IconWrapper";
import { Column } from "../../styled/Column";
import { RowGrid } from "../../styled/Row";
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import DropFileZone from "../ImportAssetsUpload/DropFileZone";

import { UPLOAD_IMAGE_MUTATION } from "../../apollo/mutations";

import {
  REGISTER_MUTATION,
  UPDATE_USER_MUTATION,
} from "../../apollo/mutations";

import {
  Box,
  Flex,
  Typography,
  Stack,
  TextInput,
  Button,
} from "@strapi/design-system";

const INITIAL_ERROR_STATE = {
  identifier: false,
  password: false,
  firstName: false,
  lastName: false,
  role: false,
  file: false,
};

const INITIAL_FORM_STATE = {
  identifier: "",
  password: "",
  firstName: "",
  lastName: "",
  role: "",
};

export default function LoginForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formError, setFormError] = useState(INITIAL_ERROR_STATE);
  const [file, setFile] = useState(null);

  const { setUser } = useContext(UserContext);

  const [registerUser, { error, loading }] = useMutation(REGISTER_MUTATION);
  const [uploadImage] = useMutation(UPLOAD_IMAGE_MUTATION);
  const [updateUserProfile, { loading: updateLoading, data: updateData }] =
    useMutation(UPDATE_USER_MUTATION);

  function formValidation() {
    let hasError = false;

    if (formData.role.length === 0) {
      setFormError((prevState) => ({ ...prevState, role: true }));
      hasError = true;
    } else {
      setFormError((prevState) => ({ ...prevState, role: false }));
    }

    if (formData.firstName.length === 0) {
      setFormError((prevState) => ({ ...prevState, firstName: true }));
      hasError = true;
    } else {
      setFormError((prevState) => ({ ...prevState, firstName: false }));
    }

    if (formData.lastName.length === 0) {
      setFormError((prevState) => ({ ...prevState, lastName: true }));
      hasError = true;
    } else {
      setFormError((prevState) => ({ ...prevState, lastName: false }));
    }

    if (formData.identifier.length === 0) {
      setFormError((prevState) => ({ ...prevState, identifier: true }));
      hasError = true;
    } else {
      setFormError((prevState) => ({ ...prevState, identifier: false }));
    }

    if (formData.password.length === 0) {
      setFormError((prevState) => ({ ...prevState, password: true }));
      hasError = true;
    } else {
      setFormError((prevState) => ({ ...prevState, password: false }));
    }

    if (file === null) {
      setFormError((prevState) => ({ ...prevState, file: true }));
      hasError = true;
    } else {
      setFormError((prevState) => ({ ...prevState, file: false }));
    }

    return hasError;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formValidation()) {
      const userResponse = await registerUser({
        variables: {
          input: {
            username: formData.identifier,
            email: formData.identifier,
            password: formData.password,
          },
        },
      });

      const { user, jwt } = userResponse.data.register;

      if (user) {
        setUser({ token: jwt, userID: user.id });

        await uploadImage({
          variables: {
            file: file,
            refId: user.id,
            ref: "plugin::users-permissions.user",
            field: "avatarPhoto",
          },
        });

        await updateUserProfile({
          variables: {
            data: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              position: formData.role,
            },
            id: user.id,
          },
        });
      }
    }
  }

  if (updateLoading) return <p>Loading...</p>;
  if (updateData) return <Navigate to="/dashboard" />;

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={loading}>
        <Column>
          <IconWrapper>
            <FaBug size={65} />
          </IconWrapper>
          <Box paddingTop={6} paddingBottom={1}>
            <Typography variant="alpha" as="h1">
              Track-A-Bug
            </Typography>
          </Box>
          <Box paddingBottom={7}>
            <Typography variant="epsilon" textColor="neutral600">
              Create new account.
            </Typography>
          </Box>
        </Column>

        <Stack size={6}>
          <Box>
            <DropFileZone
              setFile={setFile}
              file={file}
              setFormError={setFormError}
              hasError={formError.file}
            />
          </Box>
          <RowGrid>
            <TextInput
              error={formError.firstName ? "This value is required." : ""}
              value={formData.firstName}
              onChange={handleChange}
              label={"First Name"}
              placeholder={"First Name"}
              name="firstName"
              required
            />

            <TextInput
              error={formError.lastName ? "This value is required." : ""}
              value={formData.lastName}
              onChange={handleChange}
              label={"Last Name"}
              placeholder={"Last Name"}
              name="lastName"
              required
            />
          </RowGrid>

          <TextInput
            error={formError.role ? "This value is required." : ""}
            value={formData.role}
            onChange={handleChange}
            label={"Role"}
            placeholder={"Enter your role"}
            name="role"
            required
          />

          <TextInput
            error={formError.identifier ? "This value is required." : ""}
            value={formData.identifier}
            onChange={handleChange}
            label={"Email"}
            placeholder={"Enter your email"}
            name="identifier"
            required
          />

          <TextInput
            error={formError.password ? "This value is required." : ""}
            value={formData.password}
            onChange={handleChange}
            type="password"
            label={"Password"}
            placeholder={"Enter your password"}
            name="password"
            required
          />

          <Button fullWidth type="submit">
            Create Account
          </Button>

          <Flex justifyContent="center">
            <Box paddingTop={4}>
              <Link to="/" startIcon={<ArrowLeft />}>
                Already have account? Sign In.
              </Link>
            </Box>
          </Flex>

          <Box paddingTop={6}>
            {error && <ErrorMessage message={error.message} variant="danger" />}
          </Box>
        </Stack>
      </fieldset>
    </form>
  );
}
