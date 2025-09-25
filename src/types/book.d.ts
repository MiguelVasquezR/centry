export interface Book {
  id: string;
  anioPublicacion: string;
  author: string;
  descripcion: string;
  editorial: string;
  imagen: string;
  numPag: string;
  tipo: string;
  titulo: string;
  ubicacion: {
    col: number;
    repisa: string;
    row: number;
  };
}
