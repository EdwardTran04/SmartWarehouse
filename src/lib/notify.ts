import { toast } from "sonner";

export const notify = (msg: string) => toast.success(msg);
export const notifyInfo = (msg: string) => toast.info(msg);
export const notifyWarn = (msg: string) => toast.warning(msg);
export const notifyErr = (msg: string) => toast.error(msg);

/** Returns an onClick handler that fires a success toast. */
export const onClickNotify = (msg: string) => () => toast.success(msg);
