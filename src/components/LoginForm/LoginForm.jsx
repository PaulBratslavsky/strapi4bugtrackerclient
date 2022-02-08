import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useMutation } from "@apollo/client";
import { FaBug } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { Link } from '@strapi/design-system/Link';
import { IconWrapper } from "../../styled/IconWrapper";
import { Column } from "../../styled/Column";
import { ArrowLeft } from "@strapi/icons";
import { LOGIN_USER } from "../../apollo/mutations";

import {
  Box,
  Flex,
  Typography,
  Stack,
  TextInput,
  Button,
} from "@strapi/design-system";
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const INITIAL_ERROR_STATE = {
  identifier: false,
  password: false,
};

const INITIAL_FORM_STATE = {
  identifier: "",
  password: "",
};

export default function LoginForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formError, setFormError] = useState(INITIAL_ERROR_STATE);
  const { user, setUser } = useContext(UserContext);

  const [LoginMutation, { error, loading }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      if (data) {
        const { login } = data;
        setUser({ token: login.jwt, userID: login.user.id });
      }
    },
  });

  function formValidation() {
    let hasError = false;

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

    return hasError;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formValidation()) {
      LoginMutation({
        variables: {
          input: {
            identifier: formData.identifier,
            password: formData.password,
          },
        },
      });
    }
  }

  if (user) return <Navigate to="/dashboard" />;

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
              Please sign in to continue
            </Typography>
          </Box>
        </Column>

        <Stack size={6}>
          <TextInput
            error={formError.identifier ? "This value is required." : ""}
            value={formData.identifier}
            onChange={handleChange}
            type="text"
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
            Login
          </Button>

          <Flex justifyContent="center">
            <Box paddingTop={4}>
              <Link to="/register" startIcon={<ArrowLeft />}>
                New user? Sign up here.
              </Link>
            </Box>
          </Flex>

          <Box paddingTop={6}>
            {error && <ErrorMessage message={error.message} variant="danger" /> }
          </Box>
        </Stack>
      </fieldset>
    </form>
  );
}
