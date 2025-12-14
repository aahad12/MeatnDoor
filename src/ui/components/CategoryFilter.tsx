"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type CategoriesQuery } from "@/gql/graphql";

type CategoryNode = NonNullable<
	NonNullable<NonNullable<CategoriesQuery["categories"]>["edges"][number]>["node"]
>;

export const CategoryFilter = ({ categories }: { categories: CategoryNode[] }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const selectedCategories = searchParams.getAll("categories");

	const handleCategoryChange = (categoryId: string, checked: boolean) => {
		const newParams = new URLSearchParams(searchParams.toString());
		const currentSelected = newParams.getAll("categories");

		if (checked) {
			newParams.append("categories", categoryId);
		} else {
			newParams.delete("categories");
			currentSelected.filter((id) => id !== categoryId).forEach((id) => newParams.append("categories", id));
		}

		// Reset pagination when filtering
		newParams.delete("cursor");

		router.push(`${pathname}?${newParams.toString()}`);
	};

	return (
		<div className="w-64 flex-shrink-0 pr-8">
			<h3 className="mb-4 text-lg font-semibold text-[#47141e] ">Categories</h3>
			<ul className="space-y-2">
				{categories.map((category) => (
					<li key={category.id}>
						<div className="flex items-center">
							<input
								type="checkbox"
								id={category.id}
								checked={selectedCategories.includes(category.id)}
								onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
								className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
							/>
							<label htmlFor={category.id} className="ml-2 text-sm text-neutral-700">
								{category.name}
							</label>
						</div>
						{category.children && category.children.edges.length > 0 && (
							<ul className="ml-6 mt-2 space-y-2">
								{category.children.edges.map((childEdge) => (
									<li key={childEdge.node.id}>
										<div className="flex items-center">
											<input
												type="checkbox"
												id={childEdge.node.id}
												checked={selectedCategories.includes(childEdge.node.id)}
												onChange={(e) => handleCategoryChange(childEdge.node.id, e.target.checked)}
												className="h-4 w-4 rounded border-neutral-300 text-[#ed4264] focus:ring-neutral-500"
											/>
											<label htmlFor={childEdge.node.id} className="ml-2 text-sm text-neutral-700">
												{childEdge.node.name}
											</label>
										</div>
									</li>
								))}
							</ul>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};
