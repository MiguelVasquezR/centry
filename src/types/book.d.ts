export interface Book {
  id: string;
  anioPublicacion: string;
  author: string;
  autor?: string;
  descripcion: string;
  editorial: string;
  image: string;
  imagen?: string;
  numPag: string;
  tipo: string;
  titulo: string;
  ubicacion: {
    col: number;
    repisa: string;
    row: number;
  };
}
