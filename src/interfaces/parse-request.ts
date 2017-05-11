export interface IParseRequest {

    id: number;

    method: 'parse';

    params: {

        arrayBuffer: ArrayBuffer;

    };

}
