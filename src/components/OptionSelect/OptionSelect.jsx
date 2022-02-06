import React from "react";
import { Stack } from "@strapi/design-system";
import { Select, Option } from "@strapi/design-system/Select";

export default function OptionSelect({ label, options = [], placeholder, value, setValue, disabled }) {
  return (
    <Stack size={11}>
      <Select
        label={label}
        placeholder={placeholder}
        error={undefined}
        value={value}
        onChange={setValue}
        disabled={disabled}
        customizeContent={(value) => `${value}`}
      >
        {options.map((option, index) => (
          <Option key={index} value={option.value}>
            {option.key}
          </Option>
        ))}
      </Select>
    </Stack>
  );
}