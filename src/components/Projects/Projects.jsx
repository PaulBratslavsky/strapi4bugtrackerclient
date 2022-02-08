import React, { useState, useContext } from "react";
import { Box, Button } from "@strapi/design-system";
import { Plus } from "@strapi/icons";
import { useQuery } from "@apollo/client";
import { FaBug } from "react-icons/fa";
import { BaseHeaderLayout } from "@strapi/design-system/Layout";
import { PROJECTS_BY_USER_QUERY } from "../../apollo/queries";
import AddProjectForm from "../../components/AddProjectForm/AddProjectForm";
import { UserContext } from "../../context/UserContext";
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout";

import styled from "styled-components";
import Modal from "../Modal/Modal";
import ProjectsTable from "../ProjectsTable/ProjectsTable";

const BodyContainer = styled(Box)`
  margin-top: 1rem;
`;

export default function Projects() {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useContext(UserContext);

  const { loading, error, data } = useQuery(PROJECTS_BY_USER_QUERY, {
    variables: {
      id: {
        eq: user.userID,
      },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const { data: projects } = data.projects;
  const tableHeader = [
    "Id",
    "Name",
    "Description",
    "Created By",
    "Avatar",
    "Task",
    "Created At",
  ];

  const tableData = projects.map((project) => {
    const firstName = project.attributes.projectOwner.data.attributes.firstName;
    const lastName = project.attributes.projectOwner.data.attributes.lastName;
    const avatarUrl =
      project.attributes.projectOwner.data.attributes.avatarPhoto.data
        .attributes.url;

    const tableRow = {};

    tableRow.id = project.id;
    tableRow.name = project.attributes.projectName;
    tableRow.description = project.attributes.projectDescription;
    tableRow.createdBy = `${firstName} ${lastName}`;
    tableRow.avatar = avatarUrl;
    tableRow.task = project.attributes.projectItems.data.length;
    tableRow.createdAt = project.attributes.createdAt;

    return tableRow;
  });

  return (
    <Box>
      <BaseHeaderLayout
        primaryAction={
          <Button onClick={() => setIsVisible(true)} startIcon={<Plus />}>
            Add Project
          </Button>
        }
        title="Your Projects"
        subtitle={`projects: ${projects && projects.length}`}
      />
      <BodyContainer>
        {projects && projects.length > 0 ? (
          <ProjectsTable tableData={tableData} tableHeader={tableHeader} />
        ) : (
          <EmptyStateLayout
            icon={<FaBug size={75} color={"blue"} />}
            content="You don't have any content yet..."
            action={
              <Button
                variant="secondary"
                startIcon={<Plus />}
                onClick={() => setIsVisible(true)}
              >
                Add a project
              </Button>
            }
          />
        )}
      </BodyContainer>
      {isVisible && (
        <Modal
          title="Add Project"
          setIsVisible={setIsVisible}
          isVisible={isVisible}
          user={user}
        >
          <AddProjectForm />
        </Modal>
      )}
    </Box>
  );
}
