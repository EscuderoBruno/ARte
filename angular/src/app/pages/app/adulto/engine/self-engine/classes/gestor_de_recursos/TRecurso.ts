export abstract class TRecurso { //virtual
    private nombre!: string;

    public constructor() {};

    public getNombre(): string {
        return this.nombre;
    }

    public setNombre(new_nombre :string): void {
        this.nombre = new_nombre;
    }

    public loadJsonFile(filePath: string): any {
        const request = new XMLHttpRequest();
        request.open('GET', filePath, false); // El tercer parámetro indica que la solicitud es síncrona
        request.send(null);
      
        if (request.status === 200) {
          return JSON.parse(request.responseText);
        } else {
          throw new Error('Error al cargar el archivo JSON');
        }
    }

  public loadFile(filePath: string): string {
    const request = new XMLHttpRequest();
    request.open('GET', filePath, false); // El tercer parámetro indica que la solicitud es síncrona
    request.send(null);
  
    if (request.status === 200) {
      //console.log('Respuesta: ' + request.responseText);
      return request.responseText;
    } else {
      throw new Error('Error al cargar el archivo');
    }
  }
}