import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { FaBug } from "react-icons/fa";
import { IconWrapper } from "../../styled/IconWrapper";
import { Column } from "../../styled/Column";
import { RowGrid } from "../../styled/Row";
import DropFileZone from "../ImportAssetsUpload/DropFileZone";
import { isRegexValid, checkURLRegex } from "../../helpers";
import { PROJECTS_BY_USER_QUERY } from "../../apollo/queries";
import ErrorMessage from '../ErrorMessage/ErrorMessage';

import {
  UPLOAD_IMAGE_MUTATION,
  CREATE_PORTFOLIO_MUTATION,
} from "../../apollo/mutations";

import {
  Box,
  Typography,
  Stack,
  TextInput,
  Textarea,
  Button,
} from "@strapi/design-system";

const INITIAL_ERROR_STATE = {
  projectName: false,
  projectDescription: false,
  gitUrl: false,
  siteUrl: false,
  file: false,
};

const INITIAL_FORM_STATE = {
  projectName: "",
  projectDescription: "",
  gitUrl: "",
  siteUrl: "",
};

export default function AddProjectForm({ setIsVisible, user }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formError, setFormError] = useState(INITIAL_ERROR_STATE);
  const [file, setFile] = useState(null);

  const [createProject, { loading, error }] = useMutation(
    CREATE_PORTFOLIO_MUTATION
  );

  const [uploadImage, { loading: loadingUpload, error: errorUpload }] =
    useMutation(UPLOAD_IMAGE_MUTATION, {
      refetchQueries: [
        {
          query: PROJECTS_BY_USER_QUERY,
          variables: {
            id: {
              eq: user.userID,
            },
          },
        },
      ],
    });

  function validateUrlErrors(event) {
    if (event.target.value.length !== 0) {
      if (isRegexValid(event.target.value, checkURLRegex)) {
        setFormError((prevState) => ({
          ...prevState,
          [event.target.name]: false,
        }));
      } else {
        setFormError((prevState) => ({
          ...prevState,
          [event.target.name]: true,
        }));
      }
    } else {
      setFormError((prevState) => ({
        ...prevState,
        [event.target.name]: false,
      }));
    }
  }

  function formValidation() {
    let hasError = false;

    if (file === null) {
      setFormError((prevState) => ({ ...prevState, file: true }));
      hasError = true;
    } else {
      setFormError((prevState) => ({ ...prevState, file: false }));
    }

    if (formData.projectName.length === 0) {
      setFormError((prevState) => ({ ...prevState, projectName: true }));
      hasError = true;
    } else {
      setFormError((prevState) => ({ ...prevState, projectName: false }));
    }

    if (formData.projectDescription.length < 5) {
      setFormError((prevState) => ({ ...prevState, projectDescription: true }));
      hasError = true;
    } else {
      setFormError((prevState) => ({
        ...prevState,
        projectDescription: false,
      }));
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
      const response = await createProject({
        variables: {
          data: {
            projectName: formData.projectName,
            projectDescription: formData.projectDescription,
            projectOwner: user.userID,
            gitUrl: formData.gitUrl,
            siteUrl: formData.siteUrl,
            publishedAt: new Date(),
          },
        },
      });

      const { id: projectID } = response.data.createProject.data;

      await uploadImage({
        variables: {
          file: file,
          refId: projectID,
          ref: "api::project.project",
          field: "featuredImage",
        },
      });

      setIsVisible(false);
    }
  }

  if (error || errorUpload) return <p>{error.message}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={loading || loadingUpload}>
        <Column>
          <IconWrapper>
            <FaBug size={45} />
          </IconWrapper>
          <Box paddingTop={6} paddingBottom={1}>
            <Typography variant="alpha" as="h1">
              Add a new project
            </Typography>
          </Box>
          <Box paddingBottom={6}>
            <Typography variant="epsilon" textColor="neutral600">
              Complete all required fields.
            </Typography>
          </Box>
          {formError.errorMessage && (
            <Typography
              id="global-form-error"
              role="alert"
              tabIndex={-1}
              textColor="danger600"
            >
              {formError.errorMessage}
            </Typography>
          )}
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
          <TextInput
            error={formError.projectName ? "This value is required." : ""}
            value={formData.projectName}
            onChange={handleChange}
            label={"Project Name"}
            placeholder={"Project name"}
            name="projectName"
            required
          />

          <Textarea
            placeholder="Add your project description here"
            label="Project Description"
            name="projectDescription"
            error={
              formError.projectDescription
                ? "Description is too short"
                : undefined
            }
            onChange={handleChange}
          >
            {formData.projectDescription}
          </Textarea>

          <RowGrid>
            <TextInput
              error={formError.gitUrl ? "Please provide valid URL format" : ""}
              value={formData.gitUrl}
              onChange={handleChange}
              onBlur={(e) => validateUrlErrors(e)}
              label={"Github URL"}
              placeholder={"Enter your github url"}
              name="gitUrl"
            />

            <TextInput
              error={formError.siteUrl ? "Please provide valid URL format" : ""}
              value={formData.siteUrl}
              onChange={handleChange}
              onBlur={(e) => validateUrlErrors(e)}
              label={"Live site URL"}
              placeholder={"Enter your live site url"}
              name="siteUrl"
            />
          </RowGrid>

          <Button fullWidth type="submit">
            Add Project
          </Button>

          <Box paddingTop={6}>
            {(error || errorUpload)  && <ErrorMessage message={error.message|| errorUpload.message} variant="danger" /> }
          </Box>
        </Stack>
      </fieldset>
    </form>
  );
}
