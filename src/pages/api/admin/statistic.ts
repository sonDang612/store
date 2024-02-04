import { getStatisticWeb } from "@/controllers/statisticController";
import base from "@/utils/base";

const handler = base().get(getStatisticWeb);

export default handler;
