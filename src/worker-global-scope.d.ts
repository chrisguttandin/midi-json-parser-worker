// @todo For some reason the postMessage() method is missing on the WorkerGlobalScope interface but is present on the global scope.

interface WorkerGlobalScope { // tslint:disable-line:interface-name

    postMessage: typeof postMessage;

}
