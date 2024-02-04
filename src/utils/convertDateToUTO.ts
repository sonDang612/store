export const convertDateToUTO = (date: any) => {
  const date2 = new Date(date);
  return new Date(date2.getTime() + Number(date2.getTimezoneOffset()) * 60000);
  // .toISOString();
};
