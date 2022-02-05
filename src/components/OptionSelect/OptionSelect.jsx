import React, { useEffect, useState } from "react";
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

/*

import React, { useEffect, useState } from "react";
import { Stack } from "@strapi/design-system";
import { Select, Option } from "@strapi/design-system/Select";
import { Plus } from "@strapi/design-system/Icon";

export default function SelectOptions({initialOption = "Select Option", options = [], callback, setError, error, name, }) {
  const [value, setValue] = useState();

  useEffect(() => {
    callback({value});
    if (value === "initialOption") setError(true);
  },[value, callback, setError]);


  return (
    <Stack size={11}>
      <h2>Current value is {value}</h2>
      <Select
        name={name}
        id="select1"
        label="Choose your meal"
        required
        placeholder="Your example"
        hint="Description line"
        onClear={() => setValue(undefined)}
        clearLabel="Clear the meal"
        error={error}
        value={value}
        onChange={setValue}
        startIcon={<Plus />}
      >
        <Option
          value={"initialOption"}
          startIcon={
            <div
              style={{
                height: "6px",
                borderRadius: "50%",
                width: "6px",
                background: "red",
              }}
            />
          }
        >
          {initialOption}
        </Option>
        {options.map((option, index) => <Option key={index} value={option.value}>{option.key}</Option>)}
      </Select>
  
    </Stack>
  );
}
*/
