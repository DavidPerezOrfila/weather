// Ciudad guardada con sus coordenadas (evita re-geocodificar en cada consulta)
export interface City {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}
