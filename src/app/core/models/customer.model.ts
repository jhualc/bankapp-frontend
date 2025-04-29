export interface Customer {
  id?: number; // Opcional porque al crear no lo tienes aún
  name: string;
  gender: string;
  age: number;
  identification: string;
  address: string;
  phone: string;
  password: string;
  status: boolean;
}
