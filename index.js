var AWS = require('aws-sdk');
var uuid = require('uuid')
let uuidv4 = uuid.v4

var handler = async (event) => {
    var dynamodb = new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        endpoint: 'http://dynamodb:8000',
        region: 'us-west-2',
        credentials: {
            accessKeyId: '2345',
            secretAccessKey: '2345'
        }
    });

    var docClient = new AWS.DynamoDB.DocumentClient({
        apiVersion: '2012-08-10',
        service: dynamodb
    });

    let params;

    switch (event.httpMethod) {
        case "POST":
            let body = JSON.parse(event.body);
            if (event.body === null) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            message: "Empty body"
                        }
                    })
                }
            }
            if (!("destino" in body)) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            message: "destino atribute is necessary"
                        }
                    })
                }
            }
            if (!("email" in body)) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            message: "email atribute is necessary"
                        }
                    })
                }
            }

            if (typeof body.destino !== "string") {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            message: "destino must be a string"
                        }
                    })
                }
            }
            if (typeof body.email !== "string") {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            message: "email must be a string"
                        }
                    })
                }
            }
            params = {
                TableName: "Envios",
                Item: {
                    id: uuidv4(),
                    fechaAlta: new Date().toISOString(),
                    destino: body.destino,
                    email: body.email,
                    pendiente: "S",
                },
            };

            return await docClient
                .put(params)
                .promise()
                .then((data) => {
                    return {
                        statusCode: 200,
                        body: JSON.stringify(params),
                    };
                })
                .catch((err) => {
                    console.log(err);
                    return {
                        statusCode: 500,
                        body: err.message,
                    };
                });
        case 'GET':
            params = {
                TableName: "Envios",
                IndexName: 'EnviosPendientes',
                FilterExpression: "attribute_exists(pendiente)",
            };
            return await docClient
                .scan(params)
                .promise()
                .then((data) => {
                    return {
                        statusCode: 200,
                        body: JSON.stringify(data.Items),
                    };
                })
                .catch((err) => {
                    console.log(err);
                    return {
                        statusCode: 500,
                        body: err.message,
                    };
                });
        case "PUT":
            const idEnvio = (event.pathParameters || {}).idEnvio || false
            console.log(idEnvio)
            if (idEnvio === false) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: {
                            message: "You need to specify the idEnvio"
                        }
                    })
                }
            }
            params = {
                TableName: "Envios",
                Key: {
                    id: idEnvio,
                },
                UpdateExpression: "REMOVE pendiente",
                ReturnValues: "UPDATED_NEW"
            };
            return await docClient
                .update(params)
                .promise()
                .then((data) => {
                    return {
                        statusCode: 200,
                        body: JSON.stringify(params),
                    };
                })
                .catch((err) => {
                    console.log(err);
                    return {
                        statusCode: 500,
                        body: err.message,
                    };
                });
        default:
            console.log("Metodo no soportado", event.httpMethod)
            return { statusCode: 501 };
    }

}

exports.handler = handler;