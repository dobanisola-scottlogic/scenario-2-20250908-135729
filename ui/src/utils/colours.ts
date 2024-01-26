export class Colour {
  constructor(
    public readonly name: string,
    public readonly hex: string
  ) {}
}

export class Colours {
  private static colours: Colour[] = [
    new Colour('Red', '#FF0000'),
    new Colour('Blue', '#0000FF'),
    new Colour('Pink', '#FF00CC'),
    new Colour('Green', '#00CC00'),
    new Colour('Yellow', '#FFFF00'),
    new Colour('Cyan', '#00FFFF'),
  ];

  static get(index: number) {
    return this.colours[index];
  }
}
