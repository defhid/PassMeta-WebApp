export type Deserializer<T> = (value: any) => T;

export function createFieldsDeserializer<T>(fieldDeserializers: {
    [TKey in keyof T]?: Deserializer<T[TKey]>;
}): Deserializer<T> {
    return (value) => {
        if (value == null || typeof value != "object") {
            return null as T;
        }

        for (const key in fieldDeserializers) {
            const deserialize = fieldDeserializers[key];
            if (deserialize) {
                value[key] = deserialize(value[key]);
            }
        }

        return value as T;
    };
}

export function createListDeserializer<T>(itemDeserializer: Deserializer<T>): Deserializer<T[]> {
    return (value) => {
        if (value == null || !Array.isArray(value)) {
            return [];
        }

        for (let i = 0; i < value.length; ++i) {
            value[i] = itemDeserializer(value[i]);
        }

        return value as T[];
    };
}
