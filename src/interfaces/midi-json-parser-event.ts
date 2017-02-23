export interface IMidiJsonParserEvent extends Event {

    data: {

         arrayBuffer: ArrayBuffer;

         byteIndex: number;

         byteLength: number;

         index: number;

    };

}
