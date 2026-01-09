// import CustomCarousel from "../customcomponents/CustomCarousel";
// import { CustomSlider } from "../customcomponents/CustomSlider";
// import { type ProductListItemFragment } from "@/gql/graphql";

// // eslint-disable-next-line import/no-default-export
// export default function CustomPage({ products }: { products: ProductListItemFragment[] }) {
// 	return (
// 		<div>
// 			<CustomSlider />
// 			<CustomCarousel products={products} />
// 		</div>
// 	);
// }

import CustomCarousel from "../customcomponents/CustomCarousel";
import { CustomSlider } from "../customcomponents/CustomSlider";
import { type ProductListItemFragment } from "@/gql/graphql";
import * as Checkout from "@/lib/checkout";

export interface BestSellerProduct {
	id: string;
	name: string;
	slug: string;
	thumbnail: { url: string; alt: string | null } | null;
	category: { id: string; name: string; slug: string } | null;
	variants: { id: string; name: string; pricing: any }[] | null;
	attributes: { attribute: { name: string }; values: { name: string }[] }[];
	pricing: {
		priceRange: {
			start: { gross: { amount: number; currency: string } };
		} | null;
	} | null;
}

export interface BestSellerCollectionResponse {
	collection: {
		id: string;
		name: string;
		products: { edges: { node: BestSellerProduct }[] };
	} | null;
}

// GraphQL query as a string
const BEST_SELLERS_QUERY = `
  query BestSellerCollection {
  collection(slug: "best-seller") {
    id
    name
    products(first: 20) {
      edges {
        node {
          id
          name
          slug
          thumbnail { url alt }
          category { id name slug }
          attributes {
             attribute { name }
             values { name }
          }
          variants {
            id
            name
            pricing {
               price {
                 gross {
                   amount
                   currency
                 }
               }
            }
          }

          pricing {
            priceRange {
              start { gross { amount currency } }
              stop { gross { amount currency } } # optional
            }
          }
        }
      }
    }
  }
}

`;

// Fetch function using native fetch
async function getBestSellerProducts(): Promise<ProductListItemFragment[]> {
	const response = await fetch(process.env.NEXT_PUBLIC_SALEOR_API_URL as string, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query: BEST_SELLERS_QUERY }),
	});

	const { data } = (await response.json()) as { data: BestSellerCollectionResponse };
	return (data.collection?.products.edges.map((edge) => edge.node) as unknown as ProductListItemFragment[]) ?? [];
}

// Page component
// eslint-disable-next-line import/no-default-export
// eslint-disable-next-line import/no-default-export
export default async function CustomPage({ params }: { params: { channel: string } }) {
	const products = await getBestSellerProducts();

	const checkoutId = await Checkout.getIdFromCookies(params.channel);
	const checkout = await Checkout.find(checkoutId);

	const cartItems =
		checkout?.lines.reduce(
			(acc, line) => {
				if (line.variant?.id) {
					acc[line.variant.id] = {
						lineId: line.id,
						quantity: line.quantity,
					};
				}
				return acc;
			},
			{} as Record<string, { lineId: string; quantity: number }>,
		) || {};

	return (
		<div>
			<CustomSlider />
			<CustomCarousel products={products} cartItems={cartItems} />
		</div>
	);
}
