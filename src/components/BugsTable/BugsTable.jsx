import { useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_ITEM_STATUS_MUTATION } from "../../apollo/mutations";
import moment from "moment";
import styled from "styled-components";
import OptionSelect from "../OptionSelect/OptionSelect";
import { VisuallyHidden } from "@strapi/design-system";
import { Eye } from "@strapi/icons";
import Modal from "../Modal/Modal";
import EditBugForm from '../EditBugForm/EditBugForm';
import { UserContext } from '../../context/UserContext';
import {
  Box,
  Typography,
  Badge,
  Flex,
  IconButton,
} from "@strapi/design-system";
import { Table, Thead, Tbody, Tr, Td, Th } from "@strapi/design-system/Table";

function OptionTableField({ value, itemID }) {
  const [status, setStatus] = useState(value);
  const [updateItemStatus, { loading }] = useMutation(
    UPDATE_ITEM_STATUS_MUTATION
  );

  const STATUS_OPTIONS = [
    { key: "OPEN", value: "OPEN" },
    { key: "CLOSED", value: "CLOSED" },
  ];

  function handleChange(value) {
    setStatus(value);
    updateItemStatus({
      variables: {
        id: itemID,
        data: {
          status: value,
        },
      },
    });
  }

  if (loading) return <p>Loading...</p>;

  return (
    <OptionSelect
      options={STATUS_OPTIONS}
      value={status}
      setValue={handleChange}
    />
  );
}

const TableRow = styled(Tr)`
  /* cursor: pointer; */
`;

export default function BugsTable({ tableData = [], tableHeader = [], projectID }) {
  const ROW_COUNT = tableData.length;
  const COL_COUNT = tableHeader.length;
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const { user } = useContext(UserContext);

  function handleShowModal(itemID) {
    setIsVisible(true);
    setSelectedItemId(itemID)
  }

  return (
    <Box padding={3} background="neutral100">
      <Table className="test" colCount={COL_COUNT} rowCount={ROW_COUNT}>
        <Thead>
          <Tr>
            {tableHeader.map((header, index) => (
              <Th key={index}>
                <Typography variant="sigma">{header}</Typography>
              </Th>
            ))}
            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((entry) => (
            <TableRow key={entry.id}>
              {Object.keys(entry).map((value, index) => {
                const type = Object.entries(entry)[index][0];

                if (type === "briefDescription") {
                  return (
                    <Td key={index}>
                      <Typography variant="delta">
                        {entry[type].substring(0, 20)}...
                      </Typography>
                    </Td>
                  );
                }

                if (type === "type") {
                  function colorPicker(value) {
                    if (value === "FEATURE") {
                      return "success200";
                    }
                    if (value === "BUG") {
                      return "danger200";
                    }
                    if (value === "TODO") {
                      return "secondary200";
                    }
                  }

                  return (
                    <Td key={index}>
                      <Badge
                        textColor="neutral700"
                        backgroundColor={colorPicker(entry[type])}
                      >
                        {entry[type]}
                      </Badge>
                    </Td>
                  );
                }

                if (type === "status") {
                  return (
                    <Td key={index}>
                      <OptionTableField value={entry[type]} itemID={entry.id} />
                    </Td>
                  );
                }

                if (type === "dueDate") {
                  return (
                    <Td key={index}>
                      <Typography variant="delta">
                        {moment(entry[type]).format("MMM Do YY")}
                      </Typography>
                    </Td>
                  );
                }

                if (type === "createdAt") {
                  return (
                    <Td key={index}>
                      <Typography variant="delta">
                        {moment(entry[type]).format("MMM Do YY")}
                      </Typography>
                    </Td>
                  );
                }

                return (
                  <Td key={index}>
                    <Typography variant="delta">{entry[type]}</Typography>
                  </Td>
                );
              })}
              <Td>
                <Flex>
                  <IconButton
                    onClick={() => handleShowModal(entry.id)}
                    label="View"
                    noBorder
                    icon={<Eye />}
                  />
                </Flex>
              </Td>
            </TableRow>
          ))}
        </Tbody>
      </Table>
      {isVisible && (
        <Modal
          title="View and Edit Task"
          setIsVisible={setIsVisible}
          isVisible={isVisible}
          user={user}
          itemID={selectedItemId}
          projectID={projectID}
        >
          <EditBugForm />
        </Modal>
      )}
    </Box>
  );
}
