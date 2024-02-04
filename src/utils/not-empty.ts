const notEmpty = (value: any) => {
  const empty =
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0);
  return !empty;
};

export default notEmpty;
