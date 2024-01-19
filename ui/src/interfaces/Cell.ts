export class Cell {
  public static readonly CellHeight: number = 10;
  public static readonly CellWidth: number = 10;

  constructor(
    public readonly column: number,
    public readonly row: number
  ) {}

  clone = () => {
    return new Cell(this.column, this.row);
  };

  getCentreXPosition = () => {
    return (this.column + 0.5) * Cell.CellWidth;
  };

  getCentreYPosition = () => {
    return (this.row + 0.5) * Cell.CellHeight;
  };
}
