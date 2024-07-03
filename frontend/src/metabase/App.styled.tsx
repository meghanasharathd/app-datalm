import styled from "@emotion/styled";

import { color } from "metabase/lib/colors";

export const AppContainer = styled.div`

  display: flex;
  flex-direction: column;
  background-color: var(--mb-color-body-bg);
`;

export const AppContentContainer = styled.div<{

  isAdminApp: boolean;
}>`

  flex-grow: 1;
  display: flex;

  flex-direction: ${props => (props.isAdminApp ? "column" : "row")};
  position: relative;
  overflow: hidden;
  background-color: ${props =>
    props.isAdminApp ? "var(--mb-color-body-bg)" : color("content")};

  @media print {
    height: 100%;
    overflow: visible !important;
  }
`;

export const AppContent = styled.main`
  width: 100%;
  height: 100%;
  overflow: auto;
  background: linear-gradient(to bottom, var(--mb-color-body-bg), #0d0d1a);
  @media print {
    overflow: visible !important;
  }
`;
