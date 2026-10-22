import styled from "styled-components";

type PreviewProps = {
  $accent: string;
};

const PreviewPanel = styled.section<PreviewProps>`
  padding: 20px;
  border: 1px solid ${({ $accent }) => $accent};
  border-left: 5px solid ${({ $accent }) => $accent};
  border-radius: var(--radius-md);
  background: var(--color-surface);
`;

const PreviewTitle = styled.h3`
  margin: 0 0 8px;
  font-size: 17px;
`;

const PreviewText = styled.p`
  margin: 0;
  color: var(--color-muted);
  line-height: 1.6;
`;

export default function StyledPreview({
  $accent,
}: PreviewProps) {
  return (
    <PreviewPanel $accent={$accent}>
      <PreviewTitle>styled-components preview</PreviewTitle>

      <PreviewText>
        This panel uses styles defined in a TypeScript file.
        Its accent border changes when you update the primary
        design token.
      </PreviewText>
    </PreviewPanel>
  );
}