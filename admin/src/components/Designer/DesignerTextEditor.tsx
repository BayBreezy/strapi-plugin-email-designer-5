import { Box, Textarea } from "@strapi/design-system";

interface DesignerTextEditorProps {
  bodyText: string;
  onChange: (text: string) => void;
}

const DesignerTextEditor = ({ bodyText, onChange }: DesignerTextEditorProps) => {
  return (
    <Box style={{ height: "calc(100vh - 160px)", padding: "20px" }}>
      <Textarea
        onChange={(e: any) => onChange(e.target.value)}
        value={bodyText}
        style={{ resize: "vertical" }}
      />
    </Box>
  );
};

export default DesignerTextEditor;
