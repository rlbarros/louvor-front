export interface ApiResponse<T> {
  action: "consulta" | "criacao" | "atualizacao" | "exclusao";
  http_code: number;
  content: T;
  message: string;
  success: boolean;
}
