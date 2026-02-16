import { getFontSize } from "./responsive/font";
import { rWidth, rHeight, rSpacing } from "./responsive/layout";
import { useNetworkStatus } from "./network/useNetworkStatus";
import { checkPermissions, requestPermissions, PERMISSION_TYPE } from "./permission/permission";

export {
    getFontSize,
    rWidth,
    rHeight,
    rSpacing,
    useNetworkStatus,
    checkPermissions,
    requestPermissions,
    PERMISSION_TYPE,
}