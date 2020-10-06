
export class DeviceModel {
  id?: number;
  img?: string;
  serial: string;
  alias: string;
  macid: string;
  type: string;
  state?: number;

  constructor(advanceTable?) {
    {
      this.id = advanceTable.id || this.getRandomID();
      this.img = advanceTable.img || 'assets/images/user/user1.jpg';
      this.serial = advanceTable.serial || '';
      this.alias = advanceTable.alias || '';
      this.macid = advanceTable.macid || '';
      this.type = advanceTable.type || 'none';
      this.state = advanceTable.state || 3;
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
