import moment from 'moment';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


import {
  Box,
  Typography,
  Avatar,
  Badge,
} from "@strapi/design-system";
import { Table, Thead, Tbody, Tr, Td, Th } from "@strapi/design-system/Table";

const TableRow = styled(Tr)`
  cursor: pointer;
`;

export default function ProjectsTable({ tableData = [], tableHeader = [] }) {

  const ROW_COUNT = tableData.length;
  const COL_COUNT = tableHeader.length;
  const navigate = useNavigate();

  return (
    <Box padding={3} background="neutral100">
      <Table className="test"colCount={COL_COUNT} rowCount={ROW_COUNT}>
        <Thead>
          <Tr>
            {tableHeader.map((header, index) => (
              <Th key={index}>
                <Typography variant="sigma">{header}</Typography>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {tableData.map((entry) => (
            <TableRow key={entry.id} onClick={() => navigate(`/dashboard/project/${entry.id}`)}>
              {Object.keys(entry).map((value, index) => {
                const type = Object.entries(entry)[index][0];
                if (type === "avatar") {
                  return (
                    <Td key={index}>
                      <Avatar src={entry[type]} alt="portfoloio user" />
                    </Td>
                  );
                }

                if (type === "description") {
                  return (
                    <Td key={index}>
                      <Typography variant="delta">{entry[type].substring(0,65)}...</Typography>
                    </Td>
                  );
                }

                if (type === "createdAt") {
                  return (
                    <Td key={index}>
                      <Typography variant="delta">{moment(entry[type]).format("MMM Do YY")}</Typography>
                    </Td>
                  );
                }

                if (type === "task") {
                  return (
                    <Td key={index}>
                      <Typography variant="delta">{<Badge active>{entry[type]}</Badge>}</Typography>
                    </Td>
                  );
                }

                return (
                  <Td key={index}>
                    <Typography variant="epsilon">{entry[type]}</Typography>
                  </Td>
                );
              })}
            </TableRow>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
