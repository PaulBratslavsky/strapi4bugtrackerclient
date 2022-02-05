import React, { Children } from 'react';
import { Button, Typography } from "@strapi/design-system";

import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@strapi/design-system/ModalLayout";

export default function Modal({
  setIsVisible,
  title,
  children,
  ...rest
}) {
  return (
    <ModalLayout
      onClose={() => setIsVisible((prev) => !prev)}
      labelledBy="title"
    >
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          {title}
        </Typography>
      </ModalHeader>
      <ModalBody>
      {Children.map(children, (child) => {
        return React.cloneElement(child, { setIsVisible, ...rest, });
      })}
      </ModalBody>
      <ModalFooter
        endActions={ <Button
          onClick={() => setIsVisible((prev) => !prev)}
          variant="tertiary"
        >
          Cancel
        </Button>}
      />
    </ModalLayout>
  );
}
