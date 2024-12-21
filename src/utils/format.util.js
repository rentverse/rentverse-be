import _ from "lodash";
import moment from "moment-timezone";
import process from "process";

export const snakeToCamel = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => snakeToCamel(item));
  } else if (obj !== null && typeof obj === "object") {
    return _.mapValues(
      _.mapKeys(obj, (value, key) => _.camelCase(key)),
      (value) => {
        if (value instanceof Date) {
          return moment(value)
            .tz(process.env.TZ)
            .format("YYYY-MM-DD HH:mm:ss ZZ");
        }
        return snakeToCamel(value);
      }
    );
  }
  return obj;
};

export const camelToSnake = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => camelToSnake(item));
  } else if (obj !== null && typeof obj === "object") {
    return _.mapValues(
      _.mapKeys(obj, (value, key) => _.snakeCase(key)),
      (value) => {
        if (value instanceof Date) {
          return moment(value)
            .tz(process.env.TZ)
            .format("YYYY-MM-DD HH:mm:ss ZZ");
        }
        return camelToSnake(value);
      }
    );
  }
  return obj;
};

export const removeDeletedAt = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeDeletedAt(item));
  } else if (obj !== null && typeof obj === "object") {
    return _.mapValues(_.omit(obj, ["deleted_at", "deletedAt"]), (value) => {
      if (value instanceof Date) {
        return value;
      }
      return removeDeletedAt(value);
    });
  }
  return obj;
};

export const removePassword = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((item) => removePassword(item));
  } else if (obj !== null && typeof obj === "object") {
    return _.mapValues(_.omit(obj, "password"), (value) => {
      if (value instanceof Date) {
        return value;
      }
      return removePassword(value);
    });
  }
  return obj;
};
