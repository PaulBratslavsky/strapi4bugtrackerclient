import React from "react";
import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import { Box, Flex } from "@strapi/design-system";
import MainSideNav from "../../components/MainSideNav/MainSideNav";
import Projects from "../../components/Projects/Projects";
import Project from "../../components/Project/Project";
import AllBugs from "../../components/AllBugs/AllBugs";
import { ContentWrapper } from '../../styled/ContentWrapper';

const FlexBox = styled(Box)`
  flex: 1;
`;

const AppLayout = ({ children, sideNav }) => {
  return (
    <Box background="neutral100">
      <Flex alignItems="flex-start">
        {sideNav}
        <FlexBox>{children}</FlexBox>
      </Flex>
    </Box>
  );
};

export default function Dashboard() {
  return (
    <AppLayout sideNav={<MainSideNav />}>
      <ContentWrapper>
        <Routes>
          <Route path="/" element={<Projects />} />
          <Route path="/project/:projectID" element={<Project />} />
          <Route path="/bugs" element={<AllBugs />} />
        </Routes>
      </ContentWrapper>
    </AppLayout>
  );
}
