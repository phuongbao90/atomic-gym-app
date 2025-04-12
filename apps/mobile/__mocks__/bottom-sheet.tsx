import { Fragment } from "react";

export const BottomSheetModal = ({
  children = null,
  handleComponent = () => null,
  footerComponent = () => null,
}) => {
  const ProvidedHandleComponent = handleComponent;
  const ProvidedFooterComponent = footerComponent;

  return (
    <Fragment>
      {children}
      <ProvidedHandleComponent />
    </Fragment>
  );
};
