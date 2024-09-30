import {
  Box,
  Flex,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
  VisuallyHidden,
} from "@strapi/design-system";
import { Pencil } from "@strapi/icons";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { getUrl } from "../constants";
import { getTranslation } from "../utils/getTranslation";

const CoreEmailTable = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const headers = [
    { name: formatMessage({ id: getTranslation("table.header.coreEmailType") }), value: "name" },
  ];
  const coreEmailTypes = [
    {
      coreEmailType: "user-address-confirmation",
      name: formatMessage({ id: getTranslation("emailTypes.user-address-confirmation") }),
    },
    {
      coreEmailType: "reset-password",
      name: formatMessage({ id: getTranslation("emailTypes.reset-password") }),
    },
  ];

  return (
    <Box padding={3}>
      <Table colCount={headers.length + 1} rowCount={coreEmailTypes.length}>
        <Thead>
          <Tr>
            {headers.map((header) => (
              <Th key={header.value}>
                <Typography style={{ fontWeight: "bold" }} variant="sigma">
                  {header.name}
                </Typography>
              </Th>
            ))}
            <Th>
              <VisuallyHidden>Actions</VisuallyHidden>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {coreEmailTypes.map((coreEmailType, idx) => (
            <Tr key={idx}>
              <Td>
                <Typography style={{ fontWeight: "bold" }} textColor="neutral800">
                  {coreEmailType.name}
                </Typography>
              </Td>
              <Td>
                <Flex justifyContent="end" gap="8px">
                  <IconButton
                    onClick={() => navigate({ pathname: getUrl(`core/${coreEmailType.coreEmailType}`) })}
                    label={formatMessage({ id: getTranslation("table.action.edit") })}
                  >
                    <Pencil />
                  </IconButton>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CoreEmailTable;
