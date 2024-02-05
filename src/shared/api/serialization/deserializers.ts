import type { Deserializer } from "~infra/serialization";

export const dateTimeDeserializer: Deserializer<Date> = (value) => new Date(value);

export const dateTimeNullableDeserializer: Deserializer<Date | null> = (value) => value
    ? new Date(value)
    : null;
