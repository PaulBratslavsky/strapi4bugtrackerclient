import React, { useState, useContext } from "react";
import { Box, Button } from "@strapi/design-system";
import { TwoColsLayout } from "@strapi/design-system/Layout";
import { Plus, ArrowLeft } from "@strapi/icons";
import { FaBug } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { BaseHeaderLayout } from "@strapi/design-system/Layout";
import { BUGS_BY_ID_QUERY } from "../../apollo/queries";
import AddBugForm from "../../components/AddBugForm/AddBugForm";
import { EmptyStateLayout } from "@strapi/design-system/EmptyStateLayout";

import { UserContext } from "../../context/UserContext";
import BugsTable from "../BugsTable/BugsTable";
import Modal from "../Modal/Modal";
import ProjectDetails from "../ProjectDetails/ProjectDetails";

export default function Project() {
  const [isVisible, setIsVisible] = useState(false);
  const { projectID } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const { loading, error, data } = useQuery(BUGS_BY_ID_QUERY, {
    variables: {
      id: {
        eq: projectID,
      },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const { data: items } = data.items;

  const tableHeader = [
    "Id",
    "Name",
    "Brief Description",
    "Type",
    "Created By",
    "Created At",
    "Due Date",
    "Status",
    "Priority",
    "Severety",
  ];

  const tableData = items.map((item) => {
    const {
      itemName,
      itemBrief,
      type,
      status,
      owner,
      createdAt,
      dueDate,
      priority,
      severity,
    } = item.attributes;
    const firstName = owner.data.attributes.firstName;
    const lastName = owner.data.attributes.lastName;
    const fullName = `${firstName} ${lastName}`;

    const tableRow = {
      id: item.id,
      name: itemName,
      briefDescription: itemBrief,
      type: type,
      createBy: fullName,
      createdAt: createdAt,
      dueDate: dueDate,
      status: status,
      priority: priority,
      severity: severity,
    };

    return tableRow;
  });

  return (
    <div>
      <Box>
        <Box>
          <TwoColsLayout
            startCol={
              <Box>
                <BaseHeaderLayout
                  title={"Project Detail"}
                  subtitle={`tasks: ${items && items.length}`}
                  primaryAction={
                    <Button
                      onClick={() => setIsVisible(true)}
                      startIcon={<Plus />}
                    >
                      Add Bug
                    </Button>
                  }
                  secondaryAction={
                    <Button
                      variant="tertiary"
                      onClick={() => navigate(-1)}
                      startIcon={<ArrowLeft />}
                    >
                      Back to projects
                    </Button>
                  }
                />

                <Box>
                  {items && items.length > 0 ? (
                    <BugsTable
                      tableData={tableData}
                      tableHeader={tableHeader}
                      projectID={projectID}
                    />
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
                          Add a Bug/Task
                        </Button>
                      }
                    />
                  )}
                </Box>
              </Box>
            }
            endCol={<ProjectDetails projectID={projectID} />}
          />
        </Box>
      </Box>
      {isVisible && (
        <Modal
          title="Add Bug"
          setIsVisible={setIsVisible}
          isVisible={isVisible}
          user={user}
          projectID={projectID}
        >
          <AddBugForm />
        </Modal>
      )}
    </div>
  );
}
