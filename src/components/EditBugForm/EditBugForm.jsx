import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { FaBug } from "react-icons/fa";
import { IconWrapper } from "../../styled/IconWrapper";
import { Column } from "../../styled/Column";
import { RowGrid } from "../../styled/Row";
import { UPDATE_ITEM_STATUS_MUTATION } from "../../apollo/mutations";
import { BUG_BY_ID_QUERY } from "../../apollo/queries";
import { BUGS_BY_ID_QUERY } from "../../apollo/queries";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import {
  Box,
  Typography,
  Stack,
  TextInput,
  Textarea,
  Button,
} from "@strapi/design-system";

const INITIAL_ERROR_STATE = {
  itemName: false,
  itemBrief: false,
  description: false,
};

const INITIAL_FORM_STATE = {
  itemName: "",
  itemBrief: "",
  description: "",
};

export default function EditBugForm({ setIsVisible, projectID, itemID }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formError, setFormError] = useState(INITIAL_ERROR_STATE);

  const [updateItemDetail, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_ITEM_STATUS_MUTATION, {
      refetchQueries: [
        {
          query: BUGS_BY_ID_QUERY,
          variables: {
            id: {
              eq: projectID,
            },
          },
        },
      ],
    });

  const { loading, error } = useQuery(BUG_BY_ID_QUERY, {
    variables: {
      id: itemID,
    },
    onCompleted: async (data) => {
      const { itemName, itemBrief, description } = data.item.data.attributes;
      setFormData({ itemName, itemBrief, description });
    },
  });

  function formValidation() {
    let hasError = false;

    if (formData.itemName.length === 0) {
      setFormError((prevState) => ({ ...prevState, itemName: true }));
      hasError = true;
    } else {
      setFormError((prevState) => ({ ...prevState, itemName: false }));
    }

    if (formData.itemBrief.length === 0) {
      setFormError((prevState) => ({ ...prevState, itemBrief: true }));
      hasError = true;
    } else {
      setFormError((prevState) => ({ ...prevState, itemBrief: false }));
    }

    if (formData.description.length < 5) {
      setFormError((prevState) => ({ ...prevState, description: true }));
      hasError = true;
    } else {
      setFormError((prevState) => ({
        ...prevState,
        description: false,
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
      await updateItemDetail({
        variables: {
          id: itemID,
          data: {
            itemName: formData.itemName,
            itemBrief: formData.itemBrief,
            description: formData.description,
          },
        },
      });

      setIsVisible(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={loading || updateLoading}>
        <Column>
          <IconWrapper>
            <FaBug size={45} />
          </IconWrapper>
          <Box paddingTop={6} paddingBottom={1}>
            <Typography variant="alpha" as="h1">
              View or edit task/bug
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
          <RowGrid>
            <TextInput
              error={formError.itemName ? "This value is required." : ""}
              value={formData.itemName}
              onChange={handleChange}
              label={"Bug/Task Name"}
              placeholder={"Bug/Task name"}
              name="itemName"
              required
            />
          </RowGrid>

          <TextInput
            error={formError.itemBrief ? "This value is required." : ""}
            value={formData.itemBrief}
            onChange={handleChange}
            label={"Bug/Task Brief Description"}
            placeholder={"Bug/Task brief description"}
            name="itemBrief"
            required
          />

          <Textarea
            placeholder="Full Task/Bug description"
            label="Full Task/Bug description"
            name="description"
            error={
              formError.description ? "Description is too short" : undefined
            }
            onChange={handleChange}
          >
            {formData.description}
          </Textarea>

          <Button fullWidth type="submit">
            Update Item
          </Button>

          <Box paddingTop={6}>
            {(error || updateError) && (
              <ErrorMessage
                message={error.message || updateError.messager}
                variant="danger"
              />
            )}
          </Box>
        </Stack>
      </fieldset>
    </form>
  );
}
