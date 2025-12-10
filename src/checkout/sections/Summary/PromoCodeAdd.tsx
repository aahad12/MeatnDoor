import clsx from "clsx";
import { useEffect, type FC } from "react";
import { Button } from "@/checkout/components/Button";
import { TextInput } from "@/checkout/components/TextInput";
import { useCheckoutAddPromoCodeMutation } from "@/checkout/graphql";
import { type Classes } from "@/checkout/lib/globalTypes";
import { useFormSubmit } from "@/checkout/hooks/useFormSubmit";
import { FormProvider } from "@/checkout/hooks/useForm/FormProvider";
import { useForm } from "@/checkout/hooks/useForm";

interface PromoCodeFormData {
	promoCode: string;
}

interface PromoCodeAddProps extends Classes {
	inputCouponLabel?: string;
}

export const PromoCodeAdd: FC<PromoCodeAddProps> = ({ className, inputCouponLabel }) => {
	const [, checkoutAddPromoCode] = useCheckoutAddPromoCodeMutation();

	const onSubmit = useFormSubmit<PromoCodeFormData, typeof checkoutAddPromoCode>({
		scope: "checkoutAddPromoCode",
		onSubmit: checkoutAddPromoCode,
		parse: ({ promoCode, languageCode, checkoutId }) => ({
			promoCode,
			checkoutId,
			languageCode,
		}),
		onSuccess: ({ formHelpers: { resetForm } }) => resetForm(),
	});

	const form = useForm<PromoCodeFormData>({
		onSubmit,
		initialValues: { promoCode: inputCouponLabel || "" },
	});
	const {
		values: { promoCode },
	} = form;

	const showApplyButton = promoCode.length > 0;
	useEffect(() => {
		form.setFieldValue("promoCode", inputCouponLabel || "");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [inputCouponLabel]);
	return (
		<FormProvider form={form}>
			<div className={clsx("relative my-4", className)}>
				<TextInput
					required={false}
					name="promoCode"
					value={inputCouponLabel}
					// onChange={(e) => handleChange(e.target.value)}
					label="Add gift card or discount code"
				/>
				{showApplyButton && (
					<Button
						className="absolute bottom-2.5 right-3"
						variant="tertiary"
						ariaLabel="apply"
						label="Apply"
						type="submit"
					/>
				)}
			</div>
		</FormProvider>
	);
};
