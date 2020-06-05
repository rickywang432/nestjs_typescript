/*
enum MySqlDataType {
    String = 'varchar',
    DateTime = 'datetime(6)',
    Int = 'int',
    SmallInt = 'smallint',
    TinyInt = 'tinyint', // PostgreSQL does not support tiny int
    Json = 'json' // Use binary JSON by default
}
*/

enum PgDataType {
    String = 'varchar',
    DateTime = 'timestamp',
    Int = 'int4',
    BigInt = 'int8',
    SmallInt = 'int2',
    TinyInt = 'int2', // PostgreSQL does not support tiny int
    Json = 'json', // Use binary JSON by default
    JsonBinary = 'jsonb', // Use binary JSON by default
    Boolean = 'boolean',
    Float = 'float'
}

export { PgDataType as DbDataType };