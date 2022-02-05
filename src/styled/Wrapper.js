import styled from "styled-components";
import { Box } from "@strapi/design-system";

export const Wrapper = styled(Box)`
  margin: 0 auto;
  width: ${({ width }) => (width ? width : "552px")};
`;
