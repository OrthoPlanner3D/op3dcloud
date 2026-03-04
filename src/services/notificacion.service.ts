import { toast } from "sonner";

interface Props {
	message: string;
	action?: { label: string; onClick: () => void } | null;
}

export default function notificationSuccess({ message, action = null }: Props) {
	toast.success(message, {
		action: action,
	});
}
