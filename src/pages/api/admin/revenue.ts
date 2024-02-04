import { getTotalRevenue } from "@/controllers/statisticController";
import base from "@/utils/base";

const handler = base().get(getTotalRevenue);

export default handler;
