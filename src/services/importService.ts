import apiClient from "@/src/services/apiClient";
import type { CreateImportPayload, ImportItem } from "@/src/types/import";

export function getImports() {
  return apiClient.get<ImportItem[]>("/imports");
}

export function getImport(id: string) {
  return apiClient.get<ImportItem>(`/imports/${id}`);
}

export function createImport(payload: CreateImportPayload) {
  return apiClient.post<ImportItem>("/imports", payload);
}

export function updateImport(id: string, payload: Partial<CreateImportPayload>) {
  return apiClient.patch<ImportItem>(`/imports/${id}`, payload);
}

export function deleteImport(id: string) {
  return apiClient.delete<{ message: string }>(`/imports/${id}`);
}
