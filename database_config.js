var params = {
    TableName: "Envios",
    KeySchema: [
        {
            AttributeName: "id",
            KeyType: "HASH",
        },
    ],
    AttributeDefinitions: [
        {
            AttributeName: "id",
            AttributeType: "S",
        },
        {
            AttributeName: "fechaAlta",
            AttributeType: "S",
        },
        {
            AttributeName: 'destino',
            AttributeType: 'S'
        },
        {
            AttributeName: "pendiente",
            AttributeType: "S",
        },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: 'EnviosPendientes',
            KeySchema: [
                {
                    AttributeName: 'id',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'pendiente',
                    KeyType: 'RANGE'
                }
            ],
            Projection: {
                NonKeyAttributes: ['destino', 'email'],
                ProjectionType: 'INCLUDE'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        },
        {
            IndexName: 'EnvioDestino',
            KeySchema: [
                {
                    AttributeName: 'destino',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'fechaAlta',
                    KeyType: 'RANGE'
                }
            ],
            Projection: {
                NonKeyAttributes: ['id'],
                ProjectionType: 'INCLUDE'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        }
    ],
};
dynamodb.createTable(params, function (err, data) {
    if (err) ppJson(err);
    else ppJson(data);
});