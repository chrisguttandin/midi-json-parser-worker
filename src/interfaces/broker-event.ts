import { IParseRequest } from './parse-request';

export interface IBrokerEvent extends Event {

    data: IParseRequest;

}
