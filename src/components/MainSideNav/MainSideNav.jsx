import { useContext } from "react";
import styled from "styled-components";

import { FaBug } from "react-icons/fa";
import { Box } from "@strapi/design-system";
import { Typography } from "@strapi/design-system";
import { Loader } from '@strapi/design-system/Loader';
import { UserContext } from "../../context/UserContext";
import { useQuery } from "@apollo/client";
import { USER_INFO_QUERY } from "../../apollo/queries";

import {
  MainNav,
  NavSections,
  NavLink,
  NavSection,
} from "@strapi/design-system/MainNav";

import { Flex } from "@strapi/design-system/Flex";
import { Badge } from "@strapi/design-system/Badge";

import { Divider } from "@strapi/design-system";
import LogoutButton from "../LogoutButton/LogoutButton";
import AvatarImage from "../AvatarImage/AvatarImage";

const NavButtonSection = styled.div`
  padding: 1rem;
  button {
    width: 100%;
  }
`;

export default function MainSideNav() {
  const { user } = useContext(UserContext);

  const { loading, error, data } = useQuery(USER_INFO_QUERY, {
    variables: {
      id: user.userID,
    },
  });

  if (loading) return <Loader>Loading content...</Loader>;
  if (error) return <p>Error: {error.message}</p>;
  
  const { firstName, lastName, position, avatarPhoto } = data.usersPermissionsUser.data.attributes
  const { url } = avatarPhoto.data.attributes;

  return (
    <Box background="neutral100" style={{ height: "100vh" }}>
      <MainNav>
        <Box padding={2}>
          <Flex justifyContent="space-between">
            <AvatarImage size={50} src={url} alt={`${firstName} ${lastName}`} />
            <Box padding={3}>
              <Typography variant="epsilon" textColor="neutral600">
               {`${firstName} ${lastName}`}
              </Typography>
              <Badge active>{position.toLowerCase()}</Badge>
            </Box>
          </Flex>
        </Box>
        <Divider />
        <NavSections>
          <NavSection label="Projects">
            <NavLink to="/dashboard/" icon={<FaBug />}>
              Projects
            </NavLink>
          </NavSection>
          <NavSection label="Bugs">
            <NavLink to="/dashboard/bugs" icon={<FaBug />}>
              Bugs
            </NavLink>
          </NavSection>
        </NavSections>
        <NavButtonSection>
          <LogoutButton />
        </NavButtonSection>
      </MainNav>
    </Box>
  );
}
