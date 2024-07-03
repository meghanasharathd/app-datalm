import { t, jt } from "ttag";

const RocketGlobeIllustrationSrc = "app/assets/img/rocket-globe.svg";
import { useSelector } from "metabase/lib/redux";
import { getIsHosted } from "metabase/setup/selectors";

import { UpsellCard } from "./components";

export const UpsellHosting = ({ source }: { source: string }) => {
  const isHosted = useSelector(getIsHosted);

  if (isHosted) {
    return null;
  }


};

export const UpsellHostingUpdates = ({ source }: { source: string }) => {
  const isHosted = useSelector(getIsHosted);

  if (isHosted) {
    return null;
  }


};
