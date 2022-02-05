import React from "react";
import { Stack, Status, Typography } from "@strapi/design-system";

export default function ErrorMessage({ message, variant }) {
  return (
    <Stack size={3}>
      <Status variant={variant}>
        <Typography>
          <Typography fontWeight="bold">{message}</Typography>
        </Typography>
      </Status>
    </Stack>
  );
}
