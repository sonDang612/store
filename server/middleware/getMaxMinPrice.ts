import type { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import Product from "@/models/Product";
import { asyncHandler } from "@/utils/asyncHandler";
import { removeEmpty } from "@/utils/removeEmpty";

const getMaxMinPrice = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    if (!req.query?.maxMin) {
      return next();
    }

    delete req.query.maxMin;

    const maxMinPrice = await Product.aggregate([
      {
        $match: removeEmpty({
          category: req.query.category,
          active: { $ne: false },
        }),
      },
      {
        $group: {
          _id: req.query.category ? "$category" : null,
          minPrice: { $min: "$currentPrice" },
          maxPrice: { $max: "$currentPrice" },
        },
      },
    ]);

    req.maxMinPrice = {
      minPrice:
        maxMinPrice.length > 0 ? Math.floor(maxMinPrice[0].minPrice) : 0,
      maxPrice: maxMinPrice.length > 0 ? Math.ceil(maxMinPrice[0].maxPrice) : 0,
    };
    next();
  },
);
export { getMaxMinPrice };
