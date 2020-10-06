
export class MovementModel {
  id?: number;
  operation?: string;
  type?: string;
  date?: Date;
  cost?: number;
  costBuy?: number;
  description?: string;

  constructor(advanceTable?) {
    {
      this.id = advanceTable.id || this.getRandomID();
      this.operation = advanceTable.operation || 'none';
      this.type = advanceTable.type || 'none';
      this.date = advanceTable.date || new Date();
      this.cost = advanceTable.cost || -1;
      this.costBuy = advanceTable.costBuy || -1;
      this.description = advanceTable.description || 'none';
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
