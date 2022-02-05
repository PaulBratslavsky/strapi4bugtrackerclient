import styled from 'styled-components';
import { Box } from '@strapi/design-system';

const Wrapper = styled(Box)`
  margin: 0 auto;
  width: ${({ width }) => width ? width : '100%'};
`;

export const LayoutFormContent = ({ children, width }) => (
  <Wrapper
    shadow="tableShadow"
    hasRadius
    paddingTop={9}
    paddingBottom={9}
    paddingLeft={10}
    paddingRight={10}
    background="neutral0"
    justifyContent="center"
    width={width}
  >
    {children}
  </Wrapper>
);