import { Loader, Typography } from "@strapi/design-system";
import { useIntl } from "react-intl";
import { getTranslation } from "../utils/getTranslation";

/**
 * Props needed for the GlobalLoader component
 */
type GlobalLoaderProps = {
  /**
   * Whether the loader should be displayed
   */
  loading: boolean;
};

const GlobalLoader = ({ loading }: GlobalLoaderProps) => {
  const { formatMessage } = useIntl();
  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 999,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            backdropFilter: "blur(5px)",
          }}
        >
          <Loader />
          <Typography variant="beta" style={{ marginTop: "20px" }}>
            {formatMessage({ id: getTranslation("pleaseWait") })}
          </Typography>
        </div>
      )}
    </>
  );
};

export default GlobalLoader;
