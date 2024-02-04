export const convertCurrency = async (amount: number) => {
  // try {
  //   const { data } = await axios.get(
  //     "https://api.apilayer.com/exchangerates_data/convert?to=VND&from=&amount=69.72",
  //     {
  //       params: {
  //         to: "VND",
  //         from: "USD",
  //         amount,
  //       },
  //       headers: {
  //         apikey: process.env.API_LAYER_CURRENCY,
  //       },
  //     },
  //   );
  //   return data;
  // } catch (error) {
  //   console.log(error);
  // }
  const myHeaders = new Headers();
  myHeaders.append("apikey", process.env.API_LAYER_CURRENCY);

  const requestOptions: any = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  };

  return fetch(
    `https://api.apilayer.com/exchangerates_data/convert?to=VND&from=USD&amount=${
      amount || 0
    }`,
    requestOptions,
  )
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log("error", error));
};
