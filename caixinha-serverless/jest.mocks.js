jest.mock('./v2/mongo-operations.js', () => {
    return {
        connect: function () {
            console.log('connect mock')
        },
        insertDocument: function (_document) {
            return {
                "acknowledged": true,
                "insertedId": "646e588a78404a6458745770"
            }
        },
        getByIdOrThrow: function (document) {
            if (!document) {
                throw new Error(`Enitity in not found`)
            }

            return document
        }
    }
})