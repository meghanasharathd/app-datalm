import styled from "@emotion/styled";

import { Modal, Flex } from "metabase/ui";

export const ModalContent = styled(Modal.Content)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const ModalBody = styled(Modal.Body)`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const GrowFlex = styled(Flex)`
  flex-grow: 1;
`;

export const SinglePickerView = styled.div`
  border-top: 1px solid var(--mb-color-border);
  flex-grow: 1;
  height: 0;
  background: darkblue;
`;

export const ChatWithDataView = styled.div`
  width: 55%;
  margin-top: 90px;
  margin-left: 30px;
  padding: 10px;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  box-sizing: border-box;
`;

export const HeaderChatWithView = styled.h3`
  margin-bottom: 5rem;
  color: #3d3b3b;
  font-size: clamp(1rem, 2.5vw, 2rem);
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
`;

export const InputChatWithView = styled.input`
  width: 70%;
  padding: 0.5rem;
  font-size: clamp(1rem, 2.5vw, 2rem);
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #72829f;
  margin-bottom: 5rem;
`;

export const ButtonContainerView = styled.div`
  display: flex;
  justify-content: flex-end; // Align items to the right
  width: 70%;
  gap: 0.5rem; // Add some space between buttons
`;

export const ButtonView = styled.button`
  padding: 0.5rem 1rem;
  font-size: clamp(0.5rem, 2.5vw, 1rem);
  color: #fff;
  background-color: #154574;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const QueryButtonView = styled.button`
  padding: 2ch;
  margin: 2rem;
  font-size: clamp(0.5rem, 2.5vw, 1rem);
  color: #fff;
  margin-bottom: 4rem;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
