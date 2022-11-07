export class NullArgument extends Error {
    constructor() {
      super();
      this.message = 'UnexpectedInput';
      this.name = 'UnexpectedInput';
      this.stack = new Error().stack;
    }
  }