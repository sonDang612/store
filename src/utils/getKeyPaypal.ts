import axios from "axios";

export async function getKeyPaypal(token: string) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const { data: key } = await axios.get(`/api/key/paypal`, config);

  return key;
}
