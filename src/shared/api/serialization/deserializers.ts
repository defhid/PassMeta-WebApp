import type { Deserializer } from "~infra";

export const DateTimeDeserializer: Deserializer<Date> = (value) => new Date(value);

export const DateTimeNullableDeserializer: Deserializer<Date | null> = (value) => (value ? new Date(value) : null);
