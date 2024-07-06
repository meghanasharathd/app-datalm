import { useWindowEvent } from "@mantine/hooks";
import { useState, useMemo, type SetStateAction } from "react";
import { t } from "ttag";

import ErrorBoundary from "metabase/ErrorBoundary";
import { useListRecentsQuery } from "metabase/api";
import { BULK_ACTIONS_Z_INDEX } from "metabase/components/BulkActionBar";
import { useModalOpen } from "metabase/hooks/use-modal-open";
import { Modal } from "metabase/ui";
import type {
  RecentItem,
  SearchModel,
  SearchRequest,
  SearchResult,
  SearchResultId,
} from "metabase-types/api";

import type {
  EntityPickerOptions,
  EntityTab,
  TypeWithModel,
} from "../../types";
import { EntityPickerSearchInput } from "../EntityPickerSearch/EntityPickerSearch";
import { RecentsTab } from "../RecentsTab";

import {
  GrowFlex,
  ModalBody,
  ModalContent,
  SinglePickerView,
  ChatWithDataView,
  HeaderChatWithView,
  InputChatWithView,
  ButtonContainerView,
  ButtonView,
  QueryButtonView,
} from "./EntityPickerModal.styled";
import { TabsView } from "./TabsView";

export type EntityPickerModalOptions = {
  showSearch?: boolean;
  hasConfirmButtons?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  hasRecents?: boolean;
};

export const defaultOptions: EntityPickerModalOptions = {
  showSearch: true,
  hasConfirmButtons: true,
  hasRecents: true,
};

// needs to be above popovers and bulk actions
export const ENTITY_PICKER_Z_INDEX = BULK_ACTIONS_Z_INDEX;

export interface EntityPickerModalProps<Model extends string, Item> {
  title?: string;
  selectedItem: Item | null;
  initialValue?: Partial<Item>;
  onConfirm?: () => void;
  onItemSelect: (item: Item) => void;
  canSelectItem: boolean;
  onClose: () => void;
  tabs: EntityTab<Model>[];
  options?: Partial<EntityPickerOptions>;
  searchResultFilter?: (results: SearchResult[]) => SearchResult[];
  recentFilter?: (results: RecentItem[]) => RecentItem[];
  searchParams?: Partial<SearchRequest>;
  actionButtons?: JSX.Element[];
  trapFocus?: boolean;
  defaultToRecentTab?: boolean;
}

export function EntityPickerModal<
  Id extends SearchResultId,
  Model extends SearchModel,
  Item extends TypeWithModel<Id, Model>,
>({
  title = t`Choose an item`,
  onItemSelect,
  selectedItem,
  initialValue,
  onClose,
  tabs: passedTabs,
  options,
  actionButtons = [],
  searchResultFilter,
  recentFilter,
  trapFocus = true,
  searchParams,
  defaultToRecentTab = true,
}: EntityPickerModalProps<Model, Item>) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data: recentItems, isLoading: isLoadingRecentItems } =
    useListRecentsQuery(
      { context: ["views", "selections"] },
      {
        refetchOnMountOrArgChange: true,
      },
    );
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null,
  );

  const [, setShowActionButtons] = useState<boolean>(!!actionButtons.length);

  const hydratedOptions = useMemo(
    () => ({ ...defaultOptions, ...options }),
    [options],
  );

  const { open } = useModalOpen();

  const tabModels = useMemo(
    () => passedTabs.map(t => t.model).filter(Boolean),
    [passedTabs],
  );

  const filteredRecents = useMemo(() => {
    const relevantModelRecents =
      recentItems?.filter(recentItem =>
        tabModels.includes(recentItem.model as Model),
      ) || [];

    return recentFilter
      ? recentFilter(relevantModelRecents)
      : relevantModelRecents;
  }, [recentItems, tabModels, recentFilter]);

  const tabs: EntityTab<Model | "recents">[] = useMemo(
    () =>
      hydratedOptions.hasRecents && filteredRecents.length > 0
        ? [
            {
              model: "recents",
              displayName: t`Recents`,
              icon: "clock",
              element: (
                <RecentsTab
                  isLoading={isLoadingRecentItems}
                  recentItems={filteredRecents}
                  onItemSelect={onItemSelect}
                  selectedItem={selectedItem}
                />
              ),
            },
            ...passedTabs,
          ]
        : passedTabs,
    [
      selectedItem,
      onItemSelect,
      passedTabs,
      isLoadingRecentItems,
      hydratedOptions.hasRecents,
      filteredRecents,
    ],
  );

  const hasTabs = tabs.length > 1 || searchQuery;

  useWindowEvent(
    "keydown",
    event => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    },
    { capture: true, once: true },
  );

  const [isDatabaseTabActive, setIsDatabaseTabActive] = useState(false);
  const [userInput, setUserInput] = useState("");

  const handleTabChange = (model: string) => {
    if (model === "table") {
      setIsDatabaseTabActive(true);
    } else {
      setIsDatabaseTabActive(false);
    }
  };

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setUserInput(event.target.value);
  };

  const handleViewResultsClick = async () => {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: userInput }),
        },
      );

      const data = await response.json();
      // eslint-disable-next-line no-console
      console.log(data);
      // Handle the API response as needed
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Modal.Root
      opened={open}
      onClose={onClose}
      data-testid="entity-picker-modal"
      trapFocus={trapFocus}
      closeOnEscape={false} // we're doing this manually in useWindowEvent
      xOffset="10vw"
      yOffset="10dvh"
      zIndex={ENTITY_PICKER_Z_INDEX} // needs to be above popovers and bulk actions
    >
      <Modal.Overlay />
      <ModalContent h="100%">
        <Modal.Header px="1.5rem" pt="1rem" pb={hasTabs ? "1rem" : "1.5rem"}>
          <GrowFlex justify="space-between">
            <Modal.Title lh="2.5rem">{title}</Modal.Title>
            {hydratedOptions.showSearch && (
              <EntityPickerSearchInput
                models={tabModels}
                setSearchResults={setSearchResults}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchFilter={searchResultFilter}
                searchParams={searchParams}
              />
            )}
          </GrowFlex>
          <Modal.CloseButton size="lg" />
        </Modal.Header>
        <ModalBody>
          <ErrorBoundary>
            {hasTabs ? (
              <TabsView
                tabs={tabs}
                onItemSelect={onItemSelect}
                searchQuery={searchQuery}
                searchResults={searchResults}
                selectedItem={selectedItem}
                initialValue={initialValue}
                defaultToRecentTab={defaultToRecentTab}
                setShowActionButtons={setShowActionButtons}
                onTabChange={handleTabChange}
              />
            ) : (
              <SinglePickerView>{tabs[0].element}</SinglePickerView>
            )}

            {isDatabaseTabActive && (
              <ChatWithDataView>
                <HeaderChatWithView>Enter your question</HeaderChatWithView>
                <InputChatWithView
                  value={userInput}
                  onChange={handleInputChange}
                />
                <ButtonContainerView>
                  <QueryButtonView
                    style={{
                      border: "1px solid #ccc",
                      backgroundColor: "transparent",
                      color: "#000",
                      marginLeft: "8px",
                    }}
                  >
                    Query 1
                  </QueryButtonView>
                  <QueryButtonView
                    style={{
                      border: "1px solid #ccc",
                      backgroundColor: "transparent",
                      color: "#000",
                      marginLeft: "8px",
                    }}
                  >
                    Query 2
                  </QueryButtonView>
                  <QueryButtonView
                    style={{
                      border: "1px solid #ccc",
                      backgroundColor: "transparent",
                      color: "#000",
                      marginLeft: "8px",
                    }}
                  >
                    Query 3
                  </QueryButtonView>
                </ButtonContainerView>
                <ButtonContainerView>
                  <ButtonView onClick={handleViewResultsClick}>
                    View Results
                  </ButtonView>
                  <ButtonView
                    style={{ backgroundColor: "#5e5959" }}
                    onClick={onClose}
                  >
                    Go Back
                  </ButtonView>
                </ButtonContainerView>
              </ChatWithDataView>
            )}
          </ErrorBoundary>
        </ModalBody>
      </ModalContent>
    </Modal.Root>
  );
}
