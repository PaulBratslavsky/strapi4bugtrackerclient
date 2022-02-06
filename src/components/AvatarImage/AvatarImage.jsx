import React from "react";
import styled from "styled-components";
import { Box } from "@strapi/design-system";

const AvatarContainer = styled.div`
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  border-radius: 50%;
  overflow: hidden;
  img {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
`;

export default function AvatarImage({ size = 65, src, alt = "Avatar placement image." }) {
  if (!src) return null;
  return (
    <Box>
      <AvatarContainer size={size}>
        <img src={src} alt={alt} />
      </AvatarContainer>
    </Box>
  );
}
