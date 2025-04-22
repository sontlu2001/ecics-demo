import { Grid } from "antd";

const { useBreakpoint } = Grid;

export const useDeviceDetection = () => {
  const screens = useBreakpoint();
  return {
    isMobile: !screens.md,
    screens
  };
};
