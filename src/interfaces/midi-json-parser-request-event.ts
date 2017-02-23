export interface IMidiJsonParserRequestEvent extends Event {

    data: {

         arrayBuffer: ArrayBuffer;

         byteIndex: number;

         byteLength: number;

         index: number;

    };

}
