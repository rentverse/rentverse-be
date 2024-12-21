export const convertSequelizeData = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => convertSequelizeData(item));
  } else if (data !== null && typeof data === "object") {
    return { ...data.toJSON() };
  }
  return data;
};
