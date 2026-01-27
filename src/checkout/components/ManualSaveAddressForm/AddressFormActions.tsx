import { Button } from "@/checkout/components/Button";
import { IconButton } from "@/checkout/components/IconButton";
import { TrashIcon } from "@/checkout/ui-kit/icons";

interface AddressFormActionsProps {
	onDelete?: () => void;
	onCancel: () => void;
	onSubmit: () => void;
	loading: boolean;
	disabled?: boolean;
	tooltip?: string;
}

export const AddressFormActions: React.FC<AddressFormActionsProps> = ({
	onSubmit,
	onDelete,
	onCancel,
	loading,
	disabled = false,
	tooltip,
}) => {
	return (
		<div className="flex flex-row justify-end gap-2">
			{onDelete && (
				<div className="flex">
					<IconButton ariaLabel="Delete address" onClick={onDelete} icon={<TrashIcon aria-hidden />} />
				</div>
			)}

			<Button ariaLabel="Cancel editing" variant="secondary" onClick={onCancel} label="Cancel" />
			{loading ? (
				<Button
					ariaDisabled
					ariaLabel="Save address"
					onClick={(e) => e.preventDefault()}
					label="Processing…"
				/>
			) : (
				<div className="group relative">
					<Button
						ariaLabel={tooltip || "Save address"}
						onClick={disabled ? (e) => e.preventDefault() : onSubmit}
						label="Save address"
						disabled={disabled}
						ariaDisabled={disabled}
						title={tooltip}
					/>
					{disabled && tooltip && (
						<div className="absolute bottom-full right-0 mb-2 hidden w-64 rounded-md bg-neutral-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
							{tooltip}
							<div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-4 border-transparent border-t-neutral-900"></div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
