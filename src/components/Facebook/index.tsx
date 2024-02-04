import { useEffect } from "react";

import { cleanup, init } from "@/utils/fb";

const Facebook = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      init();
      return () => {
        cleanup();
      };
    }
  }, []);

  return (
    <div>
      <div id="fb-root"></div>

      <div id="fb-customer-chat" className="fb-customerchat"></div>
    </div>
  );
};
export default Facebook;
