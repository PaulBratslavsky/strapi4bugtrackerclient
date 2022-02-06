import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { FaBug } from "react-icons/fa";
import { IconWrapper } from "../../styled/IconWrapper";
import { Column } from "../../styled/Column";
import { RowGrid } from "../../styled/Row";
import { DatePicker } from "@strapi/design-system/DatePicker";
import OptionSelect from "../OptionSelect/OptionSelect";
import { CREATE_BUG_MUTATION } from "../../apollo/mutations";
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

const PRIORITY_OPTIONS = [
  { key: "IMMEDIATE", value: "IMMEDIATE" },
  { key: "HIGH", value: "HIGH" },
  { key: "MEDIUM", value: "MEDIUM" },
  { key: "LOW", value: "LOW" },
];

const SEVERITY_OPTIONS = [
  { key: "LOW", value: "LOW" },
  { key: "CRITICAL", value: "CRITICAL" },
  { key: "MAJOR", value: "MAJOR" },
  { key: "MODERATE", value: "MODERATE" },
];

const TYPE_OPTIONS = [
  { key: "FEATURE", value: "FEATURE" },
  { key: "BUG", value: "BUG" },
  { key: "TODO", value: "TODO" },
];

const INITIAL_ERROR_STATE = {
  itemName: false,
  itemBrief: false,
  description: false,
  dueDate: false,
};

const INITIAL_FORM_STATE = {
  itemName: "",
  itemBrief: "",
  description: "",
  dueDate: new Date(),
};

export default function AddBugForm({ setIsVisible, user, projectID }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formError, setFormError] = useState(INITIAL_ERROR_STATE);
  const [priority, setPriority] = useState(PRIORITY_OPTIONS[3].value);
  const [severity, setSeverity] = useState(SEVERITY_OPTIONS[0].value);
  const [type, setType] = useState(TYPE_OPTIONS[2].value);
  const [date, setDate] = useState(new Date());

  const [createBug, { loading, error }] = useMutation(CREATE_BUG_MUTATION, {
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
      const data = {
        itemName: formData.itemName,
        itemBrief: formData.itemBrief,
        description: formData.description,

        dueDate: date,
        owner: user.userID,

        type: type,
        priority: priority,

        severity: severity,
        status: "NEW",

        project: projectID,
        publishedAt: new Date(),
      };

      await createBug({
        variables: { data },
      });

      setIsVisible(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={loading}>
        <Column>
          <IconWrapper>
            <FaBug size={45} />
          </IconWrapper>
          <Box paddingTop={6} paddingBottom={1}>
            <Typography variant="alpha" as="h1">
              Add a new bug or task
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

            <DatePicker
              onChange={setDate}
              selectedDate={date}
              label="Due Date"
              name="datepicker"
              clearLabel={"Clear the datepicker"}
              onClear={() => setDate(new Date())}
              selectedDateLabel={(formattedDate) =>
                `Date picker, current is ${formattedDate}`
              }
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

          <RowGrid>
            <OptionSelect
              label="Priority"
              options={PRIORITY_OPTIONS}
              value={priority}
              setValue={setPriority}
            />

            <OptionSelect
              label="Severity"
              options={SEVERITY_OPTIONS}
              value={severity}
              setValue={setSeverity}
            />

            <OptionSelect
              label="Type"
              options={TYPE_OPTIONS}
              value={type}
              setValue={setType}
            />
          </RowGrid>

          <Button fullWidth type="submit">
            Add Bug/Task
          </Button>

          <Box paddingTop={6}>
            {error && <ErrorMessage message={error.message} variant="danger" />}
          </Box>
        </Stack>
      </fieldset>
    </form>
  );
}
