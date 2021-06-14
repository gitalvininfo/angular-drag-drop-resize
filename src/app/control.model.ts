export interface IControl{
    width?: number;
    height?: number;
    index?: number;
    xAxis?: number;
    yAxis?: number;
    cardType?: string;
  }
  
  export class Control implements IControl{
    constructor(
      public width?: number,
      public height?: number,
      public index?: number,
      public xAxis?: number,
      public yAxis?: number,
      public cardType?: string
    ){}
  }