import React, { useContext } from "react";
import { Button } from "@strapi/design-system";
import { ArrowLeft } from "@strapi/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { BaseHeaderLayout } from "@strapi/design-system/Layout";
import { GET_ALL_ITEMS_BY_OWNER } from "../../apollo/queries";
import { UserContext } from "../../context/UserContext";
import BugsTable from "../BugsTable/BugsTable";

export default function Project() {
  const { projectID } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const { loading, error, data } = useQuery(GET_ALL_ITEMS_BY_OWNER, {
    variables: {
      id: {
        eq: user.userID,
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
    <>
      <BaseHeaderLayout
        title={"All Bugs and Tasks"}
        subtitle={`tasks: ${items && items.length}`}
        primaryAction={
          <Button
            variant="tertiary"
            onClick={() => navigate(-1)}
            startIcon={<ArrowLeft />}
          >
            Back to projects
          </Button>
        }
      />
      <BugsTable
        tableData={tableData}
        tableHeader={tableHeader}
        projectID={projectID}
      />
    </>
  );
}
