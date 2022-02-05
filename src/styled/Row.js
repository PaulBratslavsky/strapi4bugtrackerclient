import styled from "styled-components";
import { Flex } from "@strapi/design-system";

export const Row = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  div {
    width: 100%;
  }
`;

export const RowGrid = styled(Flex)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  grid-gap: 1rem;
`;
